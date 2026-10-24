import { z } from "zod";
import { PLANNER_SERVICES, PLANNING_STAGES } from "./constants";
import { baseEventShape } from "./eventSchema";

export const plannerDetailsSchema = z.object({
  servicesNeeded: z.array(z.enum(PLANNER_SERVICES)).min(1, "Select at least one service"),
  guestCount: z.coerce.number().int().min(1),
  budget: z.coerce.number().positive(),
  planningStage: z.enum(PLANNING_STAGES),
  teamSize: z.coerce.number().int().min(0),
  notes: z.string().trim().max(1000).optional(),
});

export const plannerSchema = z.object({
  ...baseEventShape,
  category: z.literal("planner"),
  details: plannerDetailsSchema,
});
