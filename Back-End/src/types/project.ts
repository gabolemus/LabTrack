/* eslint-disable no-unused-vars */
import { Document } from "mongoose";

/** Enum that defines the possible project statuses */
enum ProjectStatus {
  IN_PROGRESS = "In Progress",
  COMPLETED = "Completed",
  CANCELLED = "Cancelled",
}

/** Interface for the project's lead information */
interface ILead {
  name: string;
  email: string;
}

/** Project timelapse interface */
interface ITimelapse {
  start: Date;
  end: Date;
}

/** Interface that represents a device used in a project */
interface IProjectDevice {
  id: string;
  quantity: number;
}

/** Lab project interface */
export interface IProject extends Document {
  id: string;
  name: string;
  path: string;
  courses: string[];
  description: string;
  lead: ILead;
  timelapse: ITimelapse;
  status: ProjectStatus;
  notes?: string;
  devices: IProjectDevice[];
}
