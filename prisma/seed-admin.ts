import { db } from '../src/lib/db'
import bcrypt from 'bcryptjs'

async function seedAdmin() {
  try {
    console.log('🌱 Seeding admin user...\n')

    // Hash password
    const hashedPassword = await bcrypt.hash('admin123', 10)

    // Create admin user
    const admin = await db.user.upsert({
      where: { email: 'admin@lms.com' },
      update: {},
      create: {
        name: 'Super Admin',
        email: 'admin@lms.com',
        password: hashedPassword,
        role: 'SUPER_ADMIN',
        isActive: true,
      },
    })

    console.log('✅ Admin user created successfully!')
    console.log('\n📋 Login credentials:')
    console.log('   Email:    admin@lms.com')
    console.log('   Password: admin123')
    console.log('   Role:     SUPER_ADMIN')
    console.log('\n🔗 Login URL: http://localhost:4000/auth/login')

  } catch (error) {
    console.error('❌ Error seeding admin:', error)
    process.exit(1)
  } finally {
    await db.$disconnect()
  }
}

seedAdmin()
