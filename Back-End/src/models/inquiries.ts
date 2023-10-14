import { model, Schema } from "mongoose";
import { IInquiry } from "../types/inquiry";

/** Mongoose schema for project inquiries */
const inquirySchema: Schema = new Schema(
  {
    projectName: {
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
    status: {
      type: String,
      required: true,
    },
    confirmationToken: {
      type: String,
      required: false,
    },
    modifiedByUserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
  },
  { timestamps: true },
);

export default model<IInquiry>("Inquiry", inquirySchema);
