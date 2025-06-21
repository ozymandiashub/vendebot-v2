import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    // Seed users
    const user1 = await prisma.user.create({
        data: {
            email: 'user1@example.com',
            name: 'Usuario 1',
        },
    });

    const user2 = await prisma.user.create({
        data: {
            email: 'user2@example.com',
            name: 'Usuario 2',
        },
    });

    console.log({ user1, user2 });
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });