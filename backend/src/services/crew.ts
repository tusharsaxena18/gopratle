import { prop, getModelForClass, modelOptions, Severity } from "@typegoose/typegoose";
import { BaseEvent } from "./baseEvent";
import { CREW_ROLES, EXPERIENCE_LEVELS } from "../schemas/constants";

type CrewRole = (typeof CREW_ROLES)[number];
type ExperienceLevel = (typeof EXPERIENCE_LEVELS)[number];

/** Nested shift-timing sub-document */
@modelOptions({ options: { allowMixed: Severity.ALLOW }, schemaOptions: { _id: false } })
class ShiftTiming {
  /** HH:mm format */
  @prop({ required: true, type: String, match: /^([01]\d|2[0-3]):[0-5]\d$/ })
  public start!: string;

  /** HH:mm format */
  @prop({ required: true, type: String, match: /^([01]\d|2[0-3]):[0-5]\d$/ })
  public end!: string;
}

/** Nested details document for a crew requirement */
@modelOptions({ options: { allowMixed: Severity.ALLOW }, schemaOptions: { _id: false } })
class CrewDetails {
  @prop({ type: () => [String], required: true, enum: CREW_ROLES })
  public rolesNeeded!: CrewRole[];

  @prop({ required: true, type: Number, min: 1 })
  public headcount!: number;

  @prop({ required: true, type: String, enum: EXPERIENCE_LEVELS })
  public experienceLevel!: ExperienceLevel;

  @prop({ required: true, type: () => ShiftTiming, _id: false })
  public shiftTiming!: ShiftTiming;

  @prop({ required: true, type: Number, min: 0 })
  public payPerDay!: number;

  @prop({ required: true, type: Boolean })
  public travelProvided!: boolean;

  @prop({ required: true, type: Boolean })
  public accommodationProvided!: boolean;
}

/** Crew requirement document */
export class Crew extends BaseEvent {
  @prop({ required: true, type: () => CrewDetails, _id: false })
  public details!: CrewDetails;
}

export const CrewModel = getModelForClass(Crew, {
  schemaOptions: { collection: "crews" },
});

/** Persist a validated crew requirement to MongoDB */
export async function saveCrew(data: Omit<InstanceType<typeof Crew>, "_id">) {
  return CrewModel.create(data);
}
