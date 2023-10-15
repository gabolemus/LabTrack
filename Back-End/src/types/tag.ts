import { Document } from "mongoose";

/** Tag interface */
export interface ITag extends Document {
  name: string;
}
