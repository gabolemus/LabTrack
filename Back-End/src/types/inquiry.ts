/* eslint-disable no-unused-vars */
import { Document } from "mongoose";

/** Enum that defines the possible inquiry statuses */
enum InquiryStatus {
  PENDING = "Pending",
  ACCEPTED = "Accepted",
  REJECTED = "Rejected",
}

/** Interface for the information of the person whose inquiring about starting a project */
interface IProjectRequester {
  name: string;
  email: string;
}

/** Interface that represents a device inquiry */
interface IDeviceInquiry {
  id: string;
  quantity: number;
}

/** Inquiry interface */
export interface IInquiry extends Document {
  id: string;
  projectRequester: IProjectRequester;
  devices: IDeviceInquiry[];
  projectName: string;
  courses: string[];
  status: InquiryStatus;
  createdAt: Date;
  updatedAt: Date;
}
