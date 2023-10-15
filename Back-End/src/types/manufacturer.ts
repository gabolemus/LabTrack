import { Document } from "mongoose";

/** Manufacturer interface */
export interface IManufacturer extends Document {
  id: string;
  name: string;
}
