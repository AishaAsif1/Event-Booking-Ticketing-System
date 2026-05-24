import { prisma } from "../src/config/prisma";

async function main() {
  const categories = [
    "Music",
    "Concert",
    "Workshop",
    "Technology",
    "Cybersecurity",
    "Education",
    "Sports",
    "Business",
    "AI",
    "Healthcare",
    "Startup",
    "Networking",
  ];

  const venues = [
    {
      name: "Lefkosa Event Arena",
      address: "Central Lefkosa",
      city: "Lefkosa",
      country: "Cyprus",
      maxCapacity: 1000,
    },
    {
      name: "METU NCC Conference Hall",
      address: "METU Northern Cyprus Campus",
      city: "Kalkanli",
      country: "Cyprus",
      maxCapacity: 500,
    },
    {
      name: "Tech Innovation Center",
      address: "Innovation Street",
      city: "Lefkosa",
      country: "Cyprus",
      maxCapacity: 300,
    },
    {
      name: "Business Hub Auditorium",
      address: "Business District",
      city: "Girne",
      country: "Cyprus",
      maxCapacity: 250,
    },
    {
      name: "Sports Complex Stadium",
      address: "Sports Avenue",
      city: "Lefkosa",
      country: "Cyprus",
      maxCapacity: 2000,
    },
    {
      name: "Healthcare Research Center",
      address: "Medical Campus Road",
      city: "Lefkosa",
      country: "Cyprus",
      maxCapacity: 200,
    },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: {
        name: category,
      },
      update: {},
      create: {
        name: category,
      },
    });
  }

  for (const venue of venues) {
    const existingVenue = await prisma.venue.findFirst({
      where: {
        name: venue.name,
      },
    });

    if (!existingVenue) {
      await prisma.venue.create({
        data: venue,
      });
    }
  }

  console.log("Categories and venues seeded successfully.");
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });