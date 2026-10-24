import { Category, EventType } from "./types";

export const API = process.env.NEXT_PUBLIC_API_URL ?? "/api";

export const EVENT_TYPES: EventType[] = [
  "wedding",
  "concert",
  "corporate",
  "festival",
  "birthday",
  "private_party",
  "other",
];

export const EVENT_TYPE_LABELS: Record<EventType, string> = {
  wedding: "Wedding",
  concert: "Concert",
  corporate: "Corporate",
  festival: "Festival",
  birthday: "Birthday",
  private_party: "Private Party",
  other: "Other",
};

export const CATEGORY_COLOR: Record<Category, string> = {
  planner: "bg-orange-500",
  performer: "bg-orange-600",
  crew: "bg-orange-700",
};

export const PLANNER_SERVICES = [
  "full_planning",
  "decor",
  "catering",
  "logistics",
  "vendor_coordination",
];

export const PLANNER_STAGES = ["idea", "in_progress", "almost_ready"];

export const PERFORMER_ACT_TYPES = [
  "singer",
  "dj",
  "band",
  "dancer",
  "comedian",
  "other",
];

export const PERFORMER_GENRES = [
  "rock",
  "indie",
  "folk",
  "jazz",
  "house",
  "techno",
  "pop",
  "stand-up",
  "improv",
];

export const CREW_ROLES = [
  "sound",
  "lighting",
  "security",
  "stage",
  "catering_staff",
  "other",
];

export const CREW_LEVELS = ["beginner", "intermediate", "expert"];
