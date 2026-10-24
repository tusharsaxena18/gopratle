import { z } from "zod";
import { CREW_ROLES, EXPERIENCE_LEVELS } from "./constants";
import { baseEventShape } from "./eventSchema";

const time = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Use HH:mm format");

export const crewDetailsSchema = z.object({
  rolesNeeded: z.array(z.enum(CREW_ROLES)).min(1, "Select at least one role"),
  headcount: z.coerce.number().int().min(1),
  experienceLevel: z.enum(EXPERIENCE_LEVELS),
  shiftTiming: z.object({ start: time, end: time }),
  payPerDay: z.coerce.number().positive(),
  travelProvided: z.boolean(),
  accommodationProvided: z.boolean(),
});

export const crewSchema = z.object({
  ...baseEventShape,
  category: z.literal("crew"),
  details: crewDetailsSchema,
});
