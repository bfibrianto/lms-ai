import 'dotenv/config'
import { PrismaClient } from './src/generated/prisma/client.js'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
    console.log('Fetching admin user...')
    const admin = await prisma.user.findFirst({ where: { role: 'SUPER_ADMIN' } })
    if (!admin) {
        throw new Error("No admin found. Did you run the main seed?")
    }

    console.log('Creating course...')
    const course = await prisma.course.create({
        data: {
            title: "Test Course with Markdown",
            description: "A course to test markdown rendering in free preview",
            level: "BEGINNER",
            price: 150000,
            status: "PUBLISHED",
            creatorId: admin.id,
            modules: {
                create: {
                    title: "Module 1: Introduction",
                    order: 1,
                    lessons: {
                        create: [
                            {
                                title: "Welcome to Markdown",
                                type: "TEXT",
                                content: "# Hello World\n\nThis is a **markdown** preview.\n\n- Item 1\n- Item 2\n\n```js\nconsole.log('test')\n```",
                                order: 1
                            }
                        ]
                    }
                }
            }
        }
    })

    console.log("COURSE_CREATED:", course.id)
}

main()
    .catch(console.error)
    .finally(async () => {
        await prisma.$disconnect()
    })
