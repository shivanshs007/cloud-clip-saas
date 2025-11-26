import { PrismaClient } from "@prisma/client";

declare global {
  // Avoid multiple instances in dev
  var prisma: PrismaClient | undefined;
}

const client =
  global.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") global.prisma = client;

export default client;
