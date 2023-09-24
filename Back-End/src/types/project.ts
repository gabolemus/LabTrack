/* eslint-disable no-unused-vars */
import { Document } from "mongoose";
import { IDevice } from "./device";

/** Enum that defines the possible project statuses */
enum ProjectStatus {
  IN_PROGRESS = "In Progress",
  COMPLETED = "Completed",
  CANCELLED = "Cancelled",
}

/** Project timelapse interface */
interface ITimelapse {
  start: Date;
  end: Date;
}

/** Lab project interface */
export interface IProject extends Document {
  id: string;
  name: string;
  courses: string[];
  description: string;
  lead: string;
  timelapse: ITimelapse;
  status: ProjectStatus;
  notes?: string;
  equipment: IDevice[];
}
