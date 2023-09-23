import { model, Schema } from "mongoose";
import { IManufacturer } from "../types/manufacturer";

/** Mongoose schema for manufacturers */
const manufacturerSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

export default model<IManufacturer>("Manufacturer", manufacturerSchema);
