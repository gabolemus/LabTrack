import { model, Schema } from "mongoose";
import { IProject } from "../types/project";

/** Mongoose schema for lab projects */
const projectSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    courses: {
      type: [String],
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    lead: {
      type: String,
      required: true,
    },
    timelapse: {
      start: {
        type: Date,
        required: true,
      },
      end: {
        type: Date,
        required: true,
      },
    },
    status: {
      type: String,
      required: true,
    },
    notes: {
      type: String,
      required: false,
    },
    equipment: {
      type: [Schema.Types.ObjectId],
      ref: "Device",
      required: false,
    },
  },
  { timestamps: true },
);

export default model<IProject>("Project", projectSchema);
