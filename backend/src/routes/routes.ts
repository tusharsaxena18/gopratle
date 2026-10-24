import Router, { type Request, type Response } from "express";
import { requirementSchema } from "../schemas/requirementSchema";
import { savePlanner } from "../services/planner";
import { savePerformer } from "../services/performer";
import { saveCrew } from "../services/crew";
import { getRequirements, getRequirementById } from "../services/requirements";

const router = Router();

router.get("/health", async (req: Request, res: Response) => {
  res.send("works!")
});

router.post("/register/planner", async (req: Request, res: Response) => {
  const result = requirementSchema.safeParse({ ...req.body, category: "planner" });
  if (!result.success) {
    res.status(400).json({ success: false, errors: result.error.flatten() });
    return;
  }
  const doc = await savePlanner(result.data as any);
  res.status(201).json({ success: true, data: doc.toObject() });
});

router.post("/register/performer", async (req: Request, res: Response) => {
  const result = requirementSchema.safeParse({ ...req.body, category: "performer" });
  if (!result.success) {
    res.status(400).json({ success: false, errors: result.error.flatten() });
    return;
  }
  const doc = await savePerformer(result.data as any);
  res.status(201).json({ success: true, data: doc.toObject() });
});

router.post("/register/crew", async (req: Request, res: Response) => {
  const result = requirementSchema.safeParse({ ...req.body, category: "crew" });
  if (!result.success) {
    res.status(400).json({ success: false, errors: result.error.flatten() });
    return;
  }
  const doc = await saveCrew(result.data as any);
  res.status(201).json({ success: true, data: doc.toObject() });
});

/**
 * GET /requirements?category=planner|performer|crew
 * Omit ?category to receive all requirements across every category.
 */
router.get("/requirements", async (req: Request, res: Response) => {
  // req.query values are string | string[] | ParsedQs | undefined — extract scalar only
  const rawCategory = req.query["category"];
  const category: string | undefined =
    typeof rawCategory === "string" ? rawCategory : undefined;

  try {
    const data = await getRequirements(category);
    res.status(200).json({ success: true, count: data.length, data });
  } catch (err: any) {
    if (err?.code === "INVALID_CATEGORY") {
      res.status(400).json({ success: false, message: err.message });
      return;
    }
    throw err;
  }
});

/**
 * GET /requirements/:id
 * Fetch a single requirement by its MongoDB ObjectId (tries all three collections).
 */
router.get("/requirements/:id", async (req: Request, res: Response) => {
  const id = req.params["id"] as string;
  const doc = await getRequirementById(id);
  if (!doc) {
    res.status(404).json({ success: false, message: `Requirement "${id}" not found.` });
    return;
  }
  res.status(200).json({ success: true, data: doc });
});

export default router;
