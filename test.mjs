import { PrismaClient } from './src/generated/prisma/client/index.js';
const prisma = new PrismaClient();
const course = await prisma.course.findFirst({ select: { id: true }});
console.log(course?.id);
await prisma.$disconnect();
