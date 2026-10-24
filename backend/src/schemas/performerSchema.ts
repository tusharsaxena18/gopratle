import { z } from "zod";
import { ACT_TYPES } from "./constants";
import { baseEventShape } from "./eventSchema";

export const performerDetailsSchema = z.object({
  actType: z.enum(ACT_TYPES),
  genre: z.array(z.string().trim().min(1)).min(1, "Add at least one genre"),
  performerCount: z.coerce.number().int().min(1),
  durationMinutes: z.coerce.number().int().positive(),
  fee: z.coerce.number().positive(),
  soundProvided: z.boolean(),
});

export const performerSchema = z.object({
  ...baseEventShape,
  category: z.literal("performer"),
  details: performerDetailsSchema,
});
