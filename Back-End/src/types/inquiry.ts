/* eslint-disable no-unused-vars */
import { Document } from "mongoose";

/** Enum that defines the possible inquiry statuses */
enum InquiryStatus {
  UNCONFIRMED = "Unconfirmed",
  PENDING = "Pending",
  ACCEPTED = "Accepted",
  REJECTED = "Rejected",
}

/** Project timelapse interface */
interface ITimelapse {
  start: Date;
  end: Date;
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
  projectName: string;
  courses: string[];
  description: string;
  timelapse: ITimelapse;
  projectRequester: IProjectRequester;
  devices: IDeviceInquiry[];
  status: InquiryStatus;
  confirmationToken: string;
}
