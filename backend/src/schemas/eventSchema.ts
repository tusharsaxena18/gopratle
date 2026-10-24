import { z } from "zod";
import { CATEGORIES, DATE_MODES, EVENT_TYPES } from "./constants";

const startOfToday = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

export const baseEventShape = {
  eventName: z.string().trim().min(3, "Min 3 characters").max(100),
  eventType: z.enum(EVENT_TYPES),
  dateMode: z.enum(DATE_MODES),
  startDate: z.coerce.date().refine((d) => d >= startOfToday(), {
    message: "Start date cannot be in the past",
  }),
  endDate: z.coerce.date().optional(),
  location: z.string().trim().min(2).max(100),
  venue: z.string().trim().max(150).optional(),
  category: z.enum(CATEGORIES),
};
