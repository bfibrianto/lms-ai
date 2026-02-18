import 'dotenv/config'
import { PrismaClient } from '../src/generated/prisma/client.js'
import { Role } from '../src/generated/prisma/enums.js'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'
import { hashSync } from 'bcryptjs'

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const db = new PrismaClient({ adapter })

const users = [
  {
    name: 'Super Admin',
    email: 'admin@lms.com',
    password: hashSync('admin123', 10),
    role: Role.SUPER_ADMIN,
    department: 'IT',
    position: 'System Administrator',
  },
  {
    name: 'HR Admin',
    email: 'hr@lms.com',
    password: hashSync('hr123', 10),
    role: Role.HR_ADMIN,
    department: 'Human Resources',
    position: 'HR Manager',
  },
  {
    name: 'Mentor User',
    email: 'mentor@lms.com',
    password: hashSync('mentor123', 10),
    role: Role.MENTOR,
    department: 'Engineering',
    position: 'Senior Engineer',
  },
  {
    name: 'Leader User',
    email: 'leader@lms.com',
    password: hashSync('leader123', 10),
    role: Role.LEADER,
    department: 'Engineering',
    position: 'Engineering Manager',
  },
  {
    name: 'Employee User',
    email: 'employee@lms.com',
    password: hashSync('employee123', 10),
    role: Role.EMPLOYEE,
    department: 'Engineering',
    position: 'Junior Developer',
  },
]

async function main() {
  console.log('Seeding database...')

  for (const user of users) {
    await db.user.upsert({
      where: { email: user.email },
      update: {},
      create: user,
    })
    console.log(`  Created user: ${user.email} (${user.role})`)
  }

  console.log('Seeding complete.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })
