import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not defined in environment variables");
}

const pool = new Pool({
  connectionString,
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  const categoryNames = ["Concert", "Workshop", "Seminar", "Sports"];

  for (const name of categoryNames) {
    await prisma.category.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  await prisma.venue.upsert({
    where: { id: "11111111-1111-1111-1111-111111111111" },
    update: {},
    create: {
      id: "11111111-1111-1111-1111-111111111111",
      name: "METU NCC Main Hall",
      address: "Kalkanli Campus",
      city: "Guzelyurt",
      country: "North Cyprus",
      maxCapacity: 500,
    },
  });

  await prisma.venue.upsert({
    where: { id: "22222222-2222-2222-2222-222222222222" },
    update: {},
    create: {
      id: "22222222-2222-2222-2222-222222222222",
      name: "Lefkosa Event Arena",
      address: "Central District",
      city: "Lefkosa",
      country: "North Cyprus",
      maxCapacity: 1000,
    },
  });

  const categories = await prisma.category.findMany();
  const venues = await prisma.venue.findMany();

  console.log("Seed completed successfully");
  console.log("Categories:", categories);
  console.log("Venues:", venues);
}

main()
  .catch((error) => {
    console.error("SEED ERROR:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });