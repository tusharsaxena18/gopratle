import { prop, getModelForClass, modelOptions, Severity } from "@typegoose/typegoose";
import { BaseEvent } from "./baseEvent";
import { PLANNER_SERVICES, PLANNING_STAGES } from "../schemas/constants";

type PlannerService = (typeof PLANNER_SERVICES)[number];
type PlanningStage = (typeof PLANNING_STAGES)[number];

/** Nested details document for a planner requirement */
@modelOptions({ options: { allowMixed: Severity.ALLOW }, schemaOptions: { _id: false } })
class PlannerDetails {
  @prop({ type: () => [String], required: true, enum: PLANNER_SERVICES })
  public servicesNeeded!: PlannerService[];

  @prop({ required: true, type: Number, min: 1 })
  public guestCount!: number;

  @prop({ required: true, type: Number, min: 0 })
  public budget!: number;

  @prop({ required: true, type: String, enum: PLANNING_STAGES })
  public planningStage!: PlanningStage;

  @prop({ required: true, type: Number, min: 0 })
  public teamSize!: number;

  @prop({ trim: true, maxlength: 1000 })
  public notes?: string;
}

/** Planner requirement document */
export class Planner extends BaseEvent {
  @prop({ required: true, type: () => PlannerDetails, _id: false })
  public details!: PlannerDetails;
}

export const PlannerModel = getModelForClass(Planner, {
  schemaOptions: { collection: "planners" },
});

/** Persist a validated planner requirement to MongoDB */
export async function savePlanner(data: Omit<InstanceType<typeof Planner>, "_id">) {
  return PlannerModel.create(data);
}
