/* eslint-disable no-unused-vars */
import { Document } from "mongoose";
import { IDevice } from "./device";
import { IProject } from "./project";
import { IUser } from "./user";

/** Enum that represents the possible history changes of a lab device */
export enum HistoryChange {
  CREATED = "created",
  UPDATED = "updated",
  USED_IN_PROJECT = "used in project",
}

/** Type that represents the history of a lab device */
export type HistoryEntry = {
  change: HistoryChange,
  timestamp: Date,
  description: string,
  userId: IUser["_id"],
  projectId?: IProject["_id"],
};

export interface IHistory extends Document {
  equipmentID?: IDevice["_id"];
  projectID?: IProject["_id"];
  history: HistoryEntry[];
}
