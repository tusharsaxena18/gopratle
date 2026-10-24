import dotenv from "dotenv";
dotenv.config({ quiet: true } as any);

import { connectDB } from "./config/db.config";
import { PlannerModel } from "./services/planner";
import { PerformerModel } from "./services/performer";
import { CrewModel } from "./services/crew";

function daysFromNow(n: number): Date {
  const d = new Date();
  d.setDate(d.getDate() + n);
  d.setHours(0, 0, 0, 0);
  return d;
}

const planners = [
  {
    eventName: "Royal Wedding Gala",
    eventType: "wedding",
    dateMode: "range",
    startDate: daysFromNow(30),
    endDate: daysFromNow(32),
    location: "Mumbai, Maharashtra",
    venue: "The Taj Mahal Palace",
    category: "planner",
    details: {
      servicesNeeded: ["full_planning", "decor", "catering"],
      guestCount: 500,
      budget: 2_500_000,
      planningStage: "idea",
      teamSize: 12,
      notes: "Black-tie event, vegan menu mandatory.",
    },
  },
  {
    eventName: "Corporate Annual Meet",
    eventType: "corporate",
    dateMode: "single",
    startDate: daysFromNow(14),
    location: "Bengaluru, Karnataka",
    venue: "The Leela Palace Convention Centre",
    category: "planner",
    details: {
      servicesNeeded: ["logistics", "vendor_coordination"],
      guestCount: 200,
      budget: 800_000,
      planningStage: "in_progress",
      teamSize: 6,
      notes: "AV setup and simultaneous translation required.",
    },
  },
  {
    eventName: "Summer Birthday Bash",
    eventType: "birthday",
    dateMode: "single",
    startDate: daysFromNow(7),
    location: "Goa",
    category: "planner",
    details: {
      servicesNeeded: ["decor", "catering"],
      guestCount: 80,
      budget: 150_000,
      planningStage: "almost_ready",
      teamSize: 3,
    },
  },
];

const performers = [
  {
    eventName: "Monsoon Music Festival",
    eventType: "festival",
    dateMode: "range",
    startDate: daysFromNow(45),
    endDate: daysFromNow(47),
    location: "Pune, Maharashtra",
    venue: "Shaniwarwada Grounds",
    category: "performer",
    details: {
      actType: "band",
      genre: ["indie", "folk", "jazz"],
      performerCount: 6,
      durationMinutes: 180,
      fee: 350_000,
      soundProvided: false,
    },
  },
  {
    eventName: "Private Rooftop Party",
    eventType: "private_party",
    dateMode: "single",
    startDate: daysFromNow(10),
    location: "Delhi",
    venue: "42nd Floor Sky Lounge",
    category: "performer",
    details: {
      actType: "dj",
      genre: ["house", "techno"],
      performerCount: 1,
      durationMinutes: 240,
      fee: 120_000,
      soundProvided: true,
    },
  },
  {
    eventName: "College Farewell Night",
    eventType: "other",
    dateMode: "single",
    startDate: daysFromNow(20),
    location: "Hyderabad, Telangana",
    category: "performer",
    details: {
      actType: "comedian",
      genre: ["stand-up", "improv"],
      performerCount: 2,
      durationMinutes: 90,
      fee: 60_000,
      soundProvided: true,
    },
  },
];

const crews = [
  {
    eventName: "Rock Concert Setup",
    eventType: "concert",
    dateMode: "range",
    startDate: daysFromNow(25),
    endDate: daysFromNow(26),
    location: "Chennai, Tamil Nadu",
    venue: "YMCA Grounds",
    category: "crew",
    details: {
      rolesNeeded: ["sound", "lighting", "stage"],
      headcount: 20,
      experienceLevel: "expert",
      shiftTiming: { start: "06:00", end: "22:00" },
      payPerDay: 3_500,
      travelProvided: true,
      accommodationProvided: true,
    },
  },
  {
    eventName: "Wedding Security Detail",
    eventType: "wedding",
    dateMode: "single",
    startDate: daysFromNow(18),
    location: "Jaipur, Rajasthan",
    venue: "Amber Fort Lawns",
    category: "crew",
    details: {
      rolesNeeded: ["security", "catering_staff"],
      headcount: 35,
      experienceLevel: "intermediate",
      shiftTiming: { start: "10:00", end: "23:00" },
      payPerDay: 2_200,
      travelProvided: false,
      accommodationProvided: false,
    },
  },
  {
    eventName: "Tech Conference AV Crew",
    eventType: "corporate",
    dateMode: "single",
    startDate: daysFromNow(5),
    location: "Bengaluru, Karnataka",
    category: "crew",
    details: {
      rolesNeeded: ["sound", "lighting"],
      headcount: 8,
      experienceLevel: "intermediate",
      shiftTiming: { start: "07:00", end: "19:00" },
      payPerDay: 2_800,
      travelProvided: true,
      accommodationProvided: false,
    },
  },
];

async function seed(): Promise<void> {
  await connectDB();

  console.log("Clearing existing documents...");
  await Promise.all([
    PlannerModel.deleteMany({}),
    PerformerModel.deleteMany({}),
    CrewModel.deleteMany({}),
  ]);

  console.log("Inserting seed data...");
  const [insertedPlanners, insertedPerformers, insertedCrews] = await Promise.all([
    PlannerModel.insertMany(planners as any),
    PerformerModel.insertMany(performers as any),
    CrewModel.insertMany(crews as any),
  ]);

  console.log(`\nSeeded successfully:`);
  console.log(`   • Planners  : ${insertedPlanners.length}`);
  console.log(`   • Performers: ${insertedPerformers.length}`);
  console.log(`   • Crews     : ${insertedCrews.length}`);
  console.log(`   Total       : ${insertedPlanners.length + insertedPerformers.length + insertedCrews.length} documents\n`);

  console.log("Sample IDs (useful for manual testing):");
  console.log(`   Planner  : ${insertedPlanners[0]?._id}`);
  console.log(`   Performer: ${insertedPerformers[0]?._id}`);
  console.log(`   Crew     : ${insertedCrews[0]?._id}`);

  process.exit(0);
}

seed().catch((err) => {
  console.error("❌  Seed failed:", err);
  process.exit(1);
});
