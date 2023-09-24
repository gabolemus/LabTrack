/* eslint-disable no-unused-vars */
import { Document } from "mongoose";

/** User role enum */
enum UserRole {
  ADMIN = "Admin",
  SUPER_ADMIN = "Super Admin",
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
