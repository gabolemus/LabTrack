/* eslint-disable no-unused-vars */
import { Document } from "mongoose";

/** Enum that defines the possible inquiry statuses */
enum InquiryStatus {
  PENDING = "Pending",
  ACCEPTED = "Accepted",
  REJECTED = "Rejected",
}

/** Inquiry interface */
export interface IInquiry extends Document {
  id: string;
  email: string;
  projectID: string;
  devicesID: string[];
  status: InquiryStatus;
  createdAt: Date;
  updatedAt: Date;
}
