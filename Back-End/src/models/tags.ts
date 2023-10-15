import { model, Schema } from "mongoose";
import { ITag } from "../types/tag";

/** Mongoose schema for tags */
const tagSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

export default model<ITag>("Tag", tagSchema);
