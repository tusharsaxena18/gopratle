import { z } from "zod";
import { plannerSchema } from "./plannerSchema";
import { performerSchema } from "./performerSchema";
import { crewSchema } from "./crewSchema";

type DateFields = { dateMode: "single" | "range"; startDate: Date; endDate?: Date | undefined };

export const dateRules = (data: DateFields, ctx: z.RefinementCtx) => {
  if (data.dateMode !== "range") return;
  if (!data.endDate) {
    ctx.addIssue({ code: "custom", path: ["endDate"], message: "End date is required for a date range" });
  } else if (data.endDate < data.startDate) {
    ctx.addIssue({ code: "custom", path: ["endDate"], message: "End date must be on or after start date" });
  }
};

export const requirementSchema = z
  .discriminatedUnion("category", [plannerSchema, performerSchema, crewSchema])
  .superRefine(dateRules);

export type RequirementInput = z.infer<typeof requirementSchema>;
