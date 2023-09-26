import { model, Schema } from "mongoose";
import { IDevice } from "../types/device";

/** Mongoose schema for devices */
const deviceSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    manufacturerID: {
      type: Schema.Types.ObjectId,
      ref: "Manufacturer",
      required: true,
    },
    tags: {
      type: [String],
      required: false,
    },
    quantity: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    path: {
      type: String,
      required: false,
    },
    documentation: {
      type: [
        {
          name: String,
          url: String,
        },
      ],
      required: false,
    },
    notes: {
      type: String,
      required: false,
    },
    configuration: {
      type: String,
      required: false,
    },
    images: {
      type: [String],
      required: false,
    },
  },
  { timestamps: true },
);

export default model<IDevice>("Device", deviceSchema);
