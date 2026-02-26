import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
    Image,
    Font,
} from '@react-pdf/renderer'

// You might usually want to register fonts if the default fonts aren't enough
// Font.register({
//   family: 'Inter',
//   src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZJhjp-Ek-_EeAmM.woff2',
// })

const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#ffffff',
        padding: 40,
    },
    borderWrap: {
        border: '2pt solid #0f172a',
        padding: 40,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    header: {
        fontSize: 32,
        fontWeight: 'normal',
        color: '#0f172a',
        marginBottom: 10,
        textAlign: 'center',
        textTransform: 'uppercase',
        letterSpacing: 4,
    },
    subHeader: {
        fontSize: 16,
        color: '#64748b',
        marginBottom: 40,
        textAlign: 'center',
        textTransform: 'uppercase',
        letterSpacing: 2,
    },
    presentedTo: {
        fontSize: 14,
        color: '#64748b',
        marginBottom: 10,
        textAlign: 'center',
    },
    studentName: {
        fontSize: 42,
        fontWeight: 'bold',
        color: '#0f172a',
        marginBottom: 30,
        textAlign: 'center',
    },
    forCompleting: {
        fontSize: 14,
        color: '#64748b',
        marginBottom: 10,
        textAlign: 'center',
    },
    courseName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#0f172a',
        marginBottom: 40,
        textAlign: 'center',
        paddingHorizontal: 60,
    },
    footerWrap: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 'auto',
        paddingTop: 40,
    },
    signatureWrap: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    signatureLine: {
        width: 200,
        height: 1,
        backgroundColor: '#0f172a',
        marginBottom: 10,
    },
    signatureText: {
        fontSize: 12,
        color: '#64748b',
    },
    qrWrap: {
        width: 80,
        height: 80,
        border: '1pt solid #cbd5e1',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f8fafc',
    },
    qrText: {
        fontSize: 8,
        color: '#94a3b8',
        textAlign: 'center',
    }
})

interface CertificateDocumentProps {
    studentName: string
    itemName: string
    date: string
    certificateId: string
    verificationUrl: string // Provide the URL for QR code generation or text display
}

export function CertificateDocument({
    studentName,
    itemName,
    date,
    certificateId,
    verificationUrl,
}: CertificateDocumentProps) {
    // We use standard elements. Usually we'd use react-pdf/Image with a dynamic QR code
    // generated via something like 'qrcode' library mapped to a data URI if needed.
    // For now, we will render the verification URL as text where the QR code would be.

    return (
        <Document>
            <Page size="A4" orientation="landscape" style={styles.page}>
                <View style={styles.borderWrap}>
                    <Text style={styles.header}>Certificate of Completion</Text>
                    <Text style={styles.subHeader}>LMS AI Platform</Text>

                    <Text style={styles.presentedTo}>IS PROUDLY PRESENTED TO</Text>
                    <Text style={styles.studentName}>{studentName}</Text>

                    <Text style={styles.forCompleting}>FOR SUCCESSFULLY COMPLETING THE PROGRAM</Text>
                    <Text style={styles.courseName}>{itemName}</Text>

                    <View style={styles.footerWrap}>
                        <View style={styles.signatureWrap}>
                            <View style={styles.signatureLine} />
                            <Text style={styles.signatureText}>Date: {date}</Text>
                            <Text style={styles.signatureText}>ID: {certificateId}</Text>
                        </View>

                        <View style={{ ...styles.signatureWrap, alignItems: 'flex-end' }}>
                            <View style={styles.qrWrap}>
                                <Text style={styles.qrText}>Scan to Verify</Text>
                                <Text style={{ ...styles.qrText, marginTop: 4, fontSize: 6 }}>{certificateId.slice(-8)}</Text>
                            </View>
                            <Text style={{ ...styles.signatureText, marginTop: 8 }}>Verify at: {new URL(verificationUrl).host}</Text>
                        </View>
                    </View>
                </View>
            </Page>
        </Document>
    )
}
