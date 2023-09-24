import { BaseController } from "./BaseController";
import User from "../models/users";
import { IUser } from "../types/user";

export class UsersController extends BaseController<IUser> {
  constructor() {
    super(User, "user");
  }
}

export const usersController = new UsersController();
