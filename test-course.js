const { PrismaClient } = require("./src/generated/prisma/client");
const prisma = new PrismaClient();
prisma.course.findFirst().then(c => console.log("COURSE_ID:", c.id)).finally(() => prisma.$disconnect());
