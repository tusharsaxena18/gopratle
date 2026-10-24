import { prop, modelOptions, Severity } from "@typegoose/typegoose";
import { CATEGORIES, DATE_MODES, EVENT_TYPES } from "../schemas/constants";

type EventType = (typeof EVENT_TYPES)[number];
type DateMode = (typeof DATE_MODES)[number];
type Category = (typeof CATEGORIES)[number];

/**
 * BaseEvent — shared Typegoose superclass for all requirement categories.
 * discriminatorKey is set to "category" so Mongoose can distinguish documents
 * stored in the same (or sibling) collection by category value.
 *
 * allowMixed: Severity.ALLOW suppresses W001 warnings that arise from
 * TypeScript `readonly string[]` enum types being inferred as Mixed.
 */
@modelOptions({
  options: { allowMixed: Severity.ALLOW },
  schemaOptions: {
    discriminatorKey: "category",
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
})
export class BaseEvent {
  @prop({ required: true, type: String, trim: true, minlength: 3, maxlength: 100 })
  public eventName!: string;

  @prop({ required: true, type: String, enum: EVENT_TYPES })
  public eventType!: EventType;

  @prop({ required: true, type: String, enum: DATE_MODES })
  public dateMode!: DateMode;

  @prop({ required: true, type: Date })
  public startDate!: Date;

  @prop({ type: Date })
  public endDate?: Date;

  @prop({ required: true, type: String, trim: true, minlength: 2, maxlength: 100 })
  public location!: string;

  @prop({ type: String, trim: true, maxlength: 150 })
  public venue?: string;

  @prop({ required: true, type: String, enum: CATEGORIES })
  public category!: Category;
}
