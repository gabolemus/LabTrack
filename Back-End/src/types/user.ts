/* eslint-disable no-unused-vars */
import { Document } from "mongoose";

/** User role enum */
export enum UserRole {
  // TODO: update the roles to be more descriptive
  ADMIN = "Admin", // TODO: change it to "Lab Supervisor"?
  SUPER_ADMIN = "Super Admin", // TODO: change it to "Lab Admin"?
}

/** User interface */
export interface IUser extends Document {
  id: string;
  name: string;
  email: string;
  salt: string;
  passwordHash: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}
