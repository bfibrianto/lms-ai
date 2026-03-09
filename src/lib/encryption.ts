import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const SALT_LENGTH = 64;
const TAG_LENGTH = 16;

/**
 * Gets the encryption key from environment variable.
 * Must be a 32-byte hex string (64 characters).
 */
function getEncryptionKey(): Buffer {
    let keyStr = process.env.ENCRYPTION_KEY;
    if (!keyStr) {
        // Fallback for development if not provided, but will warn
        console.warn('⚠️ ENCRYPTION_KEY is not set in environment variables! Using a temporary generic key. Please set ENCRYPTION_KEY (32-byte hex) for secure storage.');
        // Generate a deterministic fallback based on NEXTAUTH_SECRET or just a static string
        const fallbackSrc = process.env.NEXTAUTH_SECRET || 'lms-ai-fallback-encryption-key-that-should-be-replaced';
        keyStr = crypto.createHash('sha256').update(fallbackSrc).digest('hex');
    }

    if (keyStr.length !== 64) {
        // If it's not a 64-char hex string (32 bytes), hash it to make it 32 bytes
        return crypto.createHash('sha256').update(keyStr).digest();
    }

    return Buffer.from(keyStr, 'hex');
}

/**
 * Encrypts text using AES-256-GCM.
 * Returns a base64 encoded string containing the salt, iv, auth tag, and ciphertext.
 */
export function encrypt(text: string): string {
    if (!text) return text;

    try {
        const key = getEncryptionKey();
        // Generate a random salt to use with the key
        const salt = crypto.randomBytes(SALT_LENGTH);
        // We could use scrypt/pbkdf2 here to derive a key from the salt + master key, 
        // but since our master key is already 32 bytes, we can just use the IV for randomness.
        // Including salt here is extra protection if we ever switch to password-based keys.

        const iv = crypto.randomBytes(IV_LENGTH);
        const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

        let encrypted = cipher.update(text, 'utf8', 'base64');
        encrypted += cipher.final('base64');
        const authTag = cipher.getAuthTag();

        // Format: version:iv:authTag:encryptedText (version 1)
        const result = `v1:${iv.toString('base64')}:${authTag.toString('base64')}:${encrypted}`;
        return Buffer.from(result).toString('base64');
    } catch (error) {
        console.error('Encryption failed:', error);
        throw new Error('Gagal mengenkripsi data.');
    }
}

/**
 * Decrypts text that was encrypted by the encrypt() function.
 */
export function decrypt(ciphertext: string): string {
    if (!ciphertext) return ciphertext;

    try {
        const key = getEncryptionKey();

        // Ensure it's not plain text or legacy format before failing
        let decodedStr: string;
        try {
            decodedStr = Buffer.from(ciphertext, 'base64').toString('utf8');
        } catch {
            return ciphertext; // Might be plain text
        }

        const parts = decodedStr.split(':');

        // If it doesn't match our format, might be unencrypted plain text (legacy)
        if (parts.length !== 4 || parts[0] !== 'v1') {
            return ciphertext;
        }

        const [, ivBase64, authTagBase64, encryptedText] = parts;

        const iv = Buffer.from(ivBase64, 'base64');
        const authTag = Buffer.from(authTagBase64, 'base64');

        const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
        decipher.setAuthTag(authTag);

        let decrypted = decipher.update(encryptedText, 'base64', 'utf8');
        decrypted += decipher.final('utf8');

        return decrypted;
    } catch (error) {
        console.error('Decryption failed, returning empty string or original:', error);
        return ''; // Return empty rather than throwing to prevent breaking UI if key is lost
    }
}

/**
 * Masks an API key for display purposes.
 * e.g., 'AIzaSy1234567890abcdef' -> 'AIza****cdef'
 */
export function maskApiKey(key: string): string {
    if (!key) return '';

    // Some keys might be short (e.g. testing keys)
    if (key.length <= 8) {
        return '****' + key.slice(-2);
    }

    const prefix = key.substring(0, 4);
    const suffix = key.substring(key.length - 4);

    return `${prefix}****${suffix}`;
}
