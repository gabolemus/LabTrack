/* eslint-disable no-unused-vars */
import { Document } from "mongoose";
import { IManufacturer } from "./manufacturer";
import { ITag } from "./tag";

/** Enum that defines the possible device statuses */
enum DeviceStatus {
  AVAILABLE = "Available",
  IN_USE = "In Use",
  MAINTENANCE = "In Maintenance",
  BROKEN = "Broken",
}

/** Interface that represents the device's documentation */
export interface IDocumentation {
  name: string;
  url: string;
}

/** Interface that represents an image with a caption */
export interface IImage {
  caption: string;
  url: string;
}

/** Lab device interface */
export interface IDevice extends Document {
  id: string;
  name: string;
  manufacturerID: IManufacturer["_id"];
  tags: ITag["_id"][];
  quantity: number;
  status: DeviceStatus;
  path: string;
  createdAt: Date;
  updatedAt: Date;
  documentation?: IDocumentation[];
  notes?: string;
  configuration?: string;
  images?: IImage[];
}
