import mongoose from "mongoose";
import { PlannerModel } from "./planner";
import { PerformerModel } from "./performer";
import { CrewModel } from "./crew";
import { CATEGORIES } from "../schemas/constants";

// Validate a raw string is one of the known categories
function isValidCategory(cat: string): cat is (typeof CATEGORIES)[number] {
  return (CATEGORIES as readonly string[]).includes(cat);
}

/**
 * Fetch requirements from the database.
 *
 * @param category - Optional category filter ("planner" | "performer" | "crew").
 *   If omitted, results from all categories are merged and sorted by createdAt desc.
 * @throws Error with code "INVALID_CATEGORY" when an unrecognised string is supplied.
 */
export async function getRequirements(category?: string): Promise<unknown[]> {
  if (category !== undefined) {
    if (!isValidCategory(category)) {
      const err = new Error(
        `Invalid category "${category}". Must be one of: ${CATEGORIES.join(", ")}.`
      );
      (err as any).code = "INVALID_CATEGORY";
      throw err;
    }

    // Each branch references its model directly — avoids union-type inference issues
    if (category === "planner") return PlannerModel.find().lean().exec();
    if (category === "performer") return PerformerModel.find().lean().exec();
    return CrewModel.find().lean().exec();
  }

  // No category — fetch from all models in parallel and merge
  const [planners, performers, crews] = await Promise.all([
    PlannerModel.find().lean().exec(),
    PerformerModel.find().lean().exec(),
    CrewModel.find().lean().exec(),
  ]);

  const merged = [...planners, ...performers, ...crews];

  // Sort by createdAt descending so newest always comes first
  merged.sort((a, b) => {
    const tA = (a as any).createdAt?.getTime?.() ?? 0;
    const tB = (b as any).createdAt?.getTime?.() ?? 0;
    return tB - tA;
  });

  return merged;
}

/**
 * Fetch a single requirement by its MongoDB ObjectId.
 * Searches all three collections and returns the first match.
 *
 * @returns The document if found, `null` otherwise.
 */
export async function getRequirementById(id: string): Promise<unknown | null> {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;

  const [planner, performer, crew] = await Promise.all([
    PlannerModel.findById(id).lean().exec(),
    PerformerModel.findById(id).lean().exec(),
    CrewModel.findById(id).lean().exec(),
  ]);

  return planner ?? performer ?? crew ?? null;
}
