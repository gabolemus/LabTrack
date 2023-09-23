import { model, Schema } from "mongoose";
import { IInquiry } from "../types/inquiry";

/** Mongoose schema for project inquiries */
const inquirySchema: Schema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    projectID: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    devicesID: {
      type: [Schema.Types.ObjectId],
      ref: "Device",
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

export default model<IInquiry>("Inquiry", inquirySchema);
