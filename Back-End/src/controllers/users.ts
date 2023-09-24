import { BaseController } from "./BaseController";
import User from "../models/users";
import { IUser } from "../types/user";

export class UsersController extends BaseController<IUser> {
  constructor() {
    super(User, "user", "email", true);
  }
}

export const usersController = new UsersController();
