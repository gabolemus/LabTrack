import { model, Schema } from "mongoose";
import { IInquiry } from "../types/inquiry";

/** Mongoose schema for project inquiries */
const inquirySchema: Schema = new Schema(
  {
    projectRequester: {
      name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
    },
    devices: {
      type: [
        {
          id: {
            type: Schema.Types.ObjectId,
            ref: "Device",
            required: false,
          },
          quantity: Number,
        },
      ],
      required: true,
    },
    projectName: {
      type: String,
      required: true,
    },
    courses: {
      type: [String],
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
