import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
});

async function connectDB() {
  try {
    await prisma.$connect();
    console.log("Database Connected");
  } catch (error) {
    console.log("Database connection failed", error);
    process.exit(1);
  }
}

export { prisma, connectDB };
