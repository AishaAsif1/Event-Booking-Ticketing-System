import "dotenv/config";
import { PrismaClient, Role, EventStatus } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import bcrypt from "bcrypt";

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
  console.log("Starting database seed...");

  // Clear old test/demo data in safe order
  await prisma.booking.deleteMany();
  await prisma.eventImage.deleteMany();
  await prisma.event.deleteMany();
  await prisma.category.deleteMany();
  await prisma.venue.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash("Password123!", 10);

  // Demo users
  const organiser = await prisma.user.create({
    data: {
      fullName: "Demo Organiser",
      email: "organiser@example.com",
      passwordHash,
      role: Role.ORGANISER,
    },
  });

  await prisma.user.create({
    data: {
      fullName: "Demo Attendee",
      email: "attendee@example.com",
      passwordHash,
      role: Role.ATTENDEE,
    },
  });

  // Categories
  const concert = await prisma.category.create({
    data: { name: "Concert" },
  });

  const workshop = await prisma.category.create({
    data: { name: "Workshop" },
  });

  const seminar = await prisma.category.create({
    data: { name: "Seminar" },
  });

  const sports = await prisma.category.create({
    data: { name: "Sports" },
  });

  // Venues
  const metuHall = await prisma.venue.create({
    data: {
      id: "11111111-1111-1111-1111-111111111111",
      name: "METU NCC Main Hall",
      address: "Kalkanli Campus",
      city: "Guzelyurt",
      country: "North Cyprus",
      maxCapacity: 500,
    },
  });

  const lefkosaArena = await prisma.venue.create({
    data: {
      id: "22222222-2222-2222-2222-222222222222",
      name: "Lefkosa Event Arena",
      address: "Central District",
      city: "Lefkosa",
      country: "North Cyprus",
      maxCapacity: 1000,
    },
  });

  const techHub = await prisma.venue.create({
    data: {
      id: "33333333-3333-3333-3333-333333333333",
      name: "Cyprus Tech Hub",
      address: "Innovation Street",
      city: "Lefkosa",
      country: "North Cyprus",
      maxCapacity: 300,
    },
  });

  const events = [
    {
      title: "AI & Machine Learning Workshop",
      description:
        "A practical workshop introducing machine learning concepts, model training, and real-world AI applications.",
      eventDate: new Date("2026-06-05T14:00:00"),
      capacity: 80,
      price: 40,
      status: EventStatus.PUBLISHED,
      venueId: techHub.id,
      categoryId: workshop.id,
      imageUrl: "/event-images/technology.jpg",
      altText: "AI and machine learning workshop",
    },
    {
      title: "Cybersecurity Bootcamp",
      description:
        "Learn the basics of secure web development, authentication, authorization, and common security risks.",
      eventDate: new Date("2026-06-10T10:00:00"),
      capacity: 100,
      price: 35,
      status: EventStatus.PUBLISHED,
      venueId: metuHall.id,
      categoryId: workshop.id,
      imageUrl: "/event-images/cyber.jpg",
      altText: "Cybersecurity workshop",
    },
    {
      title: "IVE Live Concert",
      description:
        "An energetic live concert experience featuring music, lights, and an unforgettable stage performance.",
      eventDate: new Date("2026-06-15T20:00:00"),
      capacity: 400,
      price: 75,
      status: EventStatus.PUBLISHED,
      venueId: lefkosaArena.id,
      categoryId: concert.id,
      imageUrl: "/event-images/concert.jpg",
      altText: "Live concert crowd",
    },
    {
      title: "Startup Networking Night",
      description:
        "A networking event for students, founders, developers, and young entrepreneurs to connect and share ideas.",
      eventDate: new Date("2026-06-18T18:30:00"),
      capacity: 120,
      price: 20,
      status: EventStatus.PUBLISHED,
      venueId: techHub.id,
      categoryId: seminar.id,
      imageUrl: "/event-images/business.jpg",
      altText: "Business networking event",
    },
    {
      title: "Business Innovation Workshop",
      description:
        "A hands-on workshop about design thinking, product strategy, and solving business problems creatively.",
      eventDate: new Date("2026-06-22T13:00:00"),
      capacity: 150,
      price: 30,
      status: EventStatus.PUBLISHED,
      venueId: lefkosaArena.id,
      categoryId: workshop.id,
      imageUrl: "/event-images/business.jpg",
      altText: "Business workshop",
    },
    {
      title: "Cricket Championship Match",
      description:
        "A competitive cricket match bringing together fans for an exciting sports event.",
      eventDate: new Date("2026-06-25T16:00:00"),
      capacity: 300,
      price: 25,
      status: EventStatus.PUBLISHED,
      venueId: lefkosaArena.id,
      categoryId: sports.id,
      imageUrl: "/event-images/sports.jpg",
      altText: "Sports event",
    },
    {
      title: "Web Development Hackathon",
      description:
        "A team-based hackathon where participants build full-stack web applications under time pressure.",
      eventDate: new Date("2026-06-28T09:00:00"),
      capacity: 60,
      price: 15,
      status: EventStatus.PUBLISHED,
      venueId: techHub.id,
      categoryId: workshop.id,
      imageUrl: "/event-images/workshop.jpg",
      altText: "Web development hackathon",
    },
    {
      title: "Cloud Computing Seminar",
      description:
        "A seminar covering cloud deployment, Docker, environment variables, and production-ready applications.",
      eventDate: new Date("2026-07-02T11:00:00"),
      capacity: 90,
      price: 35,
      status: EventStatus.PUBLISHED,
      venueId: metuHall.id,
      categoryId: seminar.id,
      imageUrl: "/event-images/technology.jpg",
      altText: "Cloud computing seminar",
    },
    {
      title: "Data Science Career Talk",
      description:
        "A career-focused talk about data science, analytics, AI careers, and building a strong technical portfolio.",
      eventDate: new Date("2026-07-06T15:00:00"),
      capacity: 100,
      price: 10,
      status: EventStatus.PUBLISHED,
      venueId: metuHall.id,
      categoryId: seminar.id,
      imageUrl: "/event-images/education.jpg",
      altText: "Data science seminar",
    },
    {
      title: "Draft Demo Event",
      description:
        "This event is intentionally kept as a draft to demonstrate organiser publishing and draft handling.",
      eventDate: new Date("2026-07-10T12:00:00"),
      capacity: 50,
      price: 20,
      status: EventStatus.DRAFT,
      venueId: techHub.id,
      categoryId: workshop.id,
      imageUrl: "/event-images/default-event.jpg",
      altText: "Draft event",
    },
  ];

  for (const eventData of events) {
    const { imageUrl, altText, ...eventFields } = eventData;

    const event = await prisma.event.create({
      data: {
        ...eventFields,
        organiserId: organiser.id,
      },
    });

    await prisma.eventImage.create({
      data: {
        eventId: event.id,
        imageUrl,
        altText,
      },
    });
  }

  console.log("Seed completed successfully");
  console.log("Demo organiser login:");
  console.log("Email: organiser@example.com");
  console.log("Password: Password123!");
  console.log("Demo attendee login:");
  console.log("Email: attendee@example.com");
  console.log("Password: Password123!");
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