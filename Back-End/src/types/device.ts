/* eslint-disable no-unused-vars */
import { Document } from "mongoose";
import { IManufacturer } from "./manufacturer";

/** Enum that defines the possible device statuses */
enum DeviceStatus {
  AVAILABLE = "Available",
  IN_USE = "In Use",
  MAINTENANCE = "In Maintenance",
  BROKEN = "Broken",
}

/** Lab device interface */
export interface IDevice extends Document {
  id: string;
  name: string;
  manufacturerID: IManufacturer["_id"];
  tags: string[];
  quantity: number;
  status: DeviceStatus;
  path: string;
  createdAt: Date;
  updatedAt: Date;
  documentation?: string[];
  notes?: string;
  configuration?: string;
  images?: string;
}
