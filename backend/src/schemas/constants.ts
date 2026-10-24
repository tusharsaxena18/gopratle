export const CATEGORIES = ["planner", "performer", "crew"] as const;

export const EVENT_TYPES = [
  "wedding", "concert", "corporate", "birthday",
  "festival", "private_party", "other",
] as const;

export const DATE_MODES = ["single", "range"] as const;

// Planner
export const PLANNER_SERVICES = [
  "full_planning", "decor", "catering", "vendor_coordination", "logistics",
] as const;
export const PLANNING_STAGES = ["idea", "in_progress", "almost_ready"] as const;

// Performer
export const ACT_TYPES = ["singer", "dj", "band", "dancer", "comedian", "other"] as const;

// Crew
export const CREW_ROLES = ["sound", "lighting", "security", "stage", "catering_staff", "other"] as const;
export const EXPERIENCE_LEVELS = ["beginner", "intermediate", "expert"] as const;
