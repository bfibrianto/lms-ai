const { PrismaPg } = require("@prisma/adapter-pg");
const { PrismaClient } = require("./src/generated/prisma/client/index.js");
const pg = require("pg");
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    const admin = await prisma.user.findFirst({ where: { role: 'SUPER_ADMIN' } });
    if (!admin) throw new Error("No admin found");
    const course = await prisma.course.create({
        data: {
            title: "Test Course with Markdown",
            description: "A course to test markdown rendering in free preview",
            level: "BEGINNER",
            price: 150000,
            status: "PUBLISHED",
            creatorId: admin.id,
            slug: "test-course-markdown-" + Date.now(),
            modules: {
                create: {
                    title: "Module 1: Introduction",
                    order: 1,
                    isFree: true,
                    lessons: {
                        create: [
                            {
                                title: "Welcome to Markdown",
                                type: "TEXT",
                                content: "# Hello World\n\nThis is a **markdown** preview.\n\n- Item 1\n- Item 2\n\n```js\nconsole.log('test')\n```",
                                order: 1,
                                isPreview: true
                            }
                        ]
                    }
                }
            }
        }
    });
    console.log("COURSE_CREATED:", course.id);
}
main().catch(console.error).finally(() => prisma.$disconnect());
