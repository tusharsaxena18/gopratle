import { prop, getModelForClass, modelOptions, Severity } from "@typegoose/typegoose";
import { BaseEvent } from "./baseEvent";
import { ACT_TYPES } from "../schemas/constants";

type ActType = (typeof ACT_TYPES)[number];

/** Nested details document for a performer requirement */
@modelOptions({ options: { allowMixed: Severity.ALLOW }, schemaOptions: { _id: false } })
class PerformerDetails {
  @prop({ required: true, type: String, enum: ACT_TYPES })
  public actType!: ActType;

  @prop({ type: () => [String], required: true })
  public genre!: string[];

  @prop({ required: true, type: Number, min: 1 })
  public performerCount!: number;

  @prop({ required: true, type: Number, min: 1 })
  public durationMinutes!: number;

  @prop({ required: true, type: Number, min: 0 })
  public fee!: number;

  @prop({ required: true, type: Boolean })
  public soundProvided!: boolean;
}

/** Performer requirement document */
export class Performer extends BaseEvent {
  @prop({ required: true, type: () => PerformerDetails, _id: false })
  public details!: PerformerDetails;
}

export const PerformerModel = getModelForClass(Performer, {
  schemaOptions: { collection: "performers" },
});

/** Persist a validated performer requirement to MongoDB */
export async function savePerformer(data: Omit<InstanceType<typeof Performer>, "_id">) {
  return PerformerModel.create(data);
}
