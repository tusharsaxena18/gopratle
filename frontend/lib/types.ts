export type EventType =
  | "wedding"
  | "concert"
  | "corporate"
  | "festival"
  | "birthday"
  | "private_party"
  | "other";

export type Category = "planner" | "performer" | "crew";
export type DateMode = "single" | "range";
export type FilterCategory = "all" | Category;

export interface EventRequirement {
  _id: string;
  eventName: string;
  eventType: EventType;
  dateMode: DateMode;
  startDate: string;
  endDate?: string;
  location: string;
  venue?: string;
  category: Category;
  details: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}
