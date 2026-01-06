import { PrismaClient } from "@prisma/client";
import type { QueryEvent } from "@prisma/client/runtime/library";

const prisma = new PrismaClient();

prisma.$on("query", (e: QueryEvent) => {
  console.log(`Query: ${e.query}`);
  console.log(`Params: ${e.params}`);
  console.log(`Duration: ${e.duration}ms`);
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
export {QueryEvent}
