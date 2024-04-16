import { PrismaClient } from "@prisma/client";
// below setup allows me to not create a new prisma db ping everytime i edit the code in dev
declare global {
    var prisma: PrismaClient | undefined;
}

export const db = globalThis.prisma || new PrismaClient()

if(process.env.NODE_ENV !== "production") {
    globalThis.prisma = db
}
