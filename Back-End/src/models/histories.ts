import { model, Schema } from "mongoose";
import { IHistory } from "../types/history";

/** Mongoose schema for histories */
const historiesSchema: Schema = new Schema(
  {
    equipmentId: {
      type: Schema.Types.ObjectId,
      ref: "Device",
      required: true,
    },
    history: [
      {
        change: {
          type: String,
          enum: ["created", "updated", "used in project"],
          required: true,
        },
        timestamp: {
          type: Date,
          required: false,
        },
        description: {
          type: String,
          required: true,
        },
        userId: {
          type: Schema.Types.ObjectId,
          ref: "User",
          required: false,
        },
        projectId: {
          type: Schema.Types.ObjectId,
          ref: "Project",
          required: false,
        },
      },
    ],
  },
  { timestamps: true },
);

export default model<IHistory>("History", historiesSchema);
