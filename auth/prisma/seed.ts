import { PrismaClient, Role } from "@prisma/client";
import * as bcrypt from "bcrypt";
const prisma = new PrismaClient();

async function main(): Promise<void> {
    await prisma.role.createMany({
        data: [
            {name: "Super Admin"},
            {name: "Student"},
        ]
    });

    const { id }: Pick<Role, 'id'> = await prisma.role.findFirst({
        where: { name: "Super Admin" },
    });

    await prisma.user.create({
        data: {
            firstName: "Shashank",
            lastName: "Jha",
            password: await bcrypt.hash(process.env.SUPER_ADMIN_PASSWORD, 10),
            role: {
                connect: {
                    id,
                },
            },
            userEmail: {
                create: {
                    email: "admin@lbtechnology.co",
                    verifiedAt: new Date(),
                }
            },
        },
    });
}

main()
    .catch(e => {
        console.log(e);
        process.exit(1);
    })
    .finally(() => {
        prisma.$disconnect;
    });