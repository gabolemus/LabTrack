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
  manufacturer: IManufacturer;
  quantity: number;
  status: DeviceStatus;
  createdAt: Date;
  updatedAt: Date;
  documentation?: string[];
  configuration?: string;
  images?: string;
}
