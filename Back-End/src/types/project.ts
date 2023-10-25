/* eslint-disable no-unused-vars */
import { Document } from "mongoose";

/** Enum that defines the possible project statuses */
enum ProjectStatus {
  NOT_STARTED = "Not Started",
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
  _id: string;
  id: string;
  quantity: number;
}

/** Interface that represents an image with a caption */
export interface IImage {
  caption: string;
  url: string;
}

/** Lab project interface */
export interface IProject extends Document {
  name: string;
  path: string;
  courses: string[];
  description: string;
  lead: ILead;
  timelapse: ITimelapse;
  status: ProjectStatus;
  notes?: string;
  devices: IProjectDevice[];
  images?: IImage[];
}
