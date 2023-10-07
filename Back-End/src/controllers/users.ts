import { Request, Response } from "express";
import { BaseController } from "./BaseController";
import User from "../models/users";
import { IUser, UserRole } from "../types/user";
import argon2 from "argon2";
import { randomBytes } from "crypto";
import logger from "../utils/logger";

export class UsersController extends BaseController<IUser> {
  constructor() {
    super(User, "user", "email", true);
  }

  public createItem = async (req: Request, res: Response): Promise<void> => {
    try {
      // Blur the password in the logs
      logger.info(`POST /${this.modelName} ${JSON.stringify({ ...req.body, password: "********" })}`);

      // Check that all the required fields are present
      if (!req.body.name || !req.body.email || !req.body.password || !req.body.role) {
        res.status(400).json({
          success: false,
          error: "MISSING_FIELDS",
          message: "The 'name', 'email', 'password', and 'role' fields are required",
        });
        return;
      }

      // Get the body of the request
      const { name, email, password, role } = req.body;

      // Check that the email is not already in use
      const filterQuery: Partial<Record<string, any>> = {};
      filterQuery[this.uniqueFieldName] = email;
      const existingItem = await this.model.findOne(filterQuery);

      if (existingItem) {
        res.status(400).json({
          success: false,
          error: "ENFORCE_UNIQUE_FIELD",
          message: `An entry in the ${this.modelName}s collection already exists with the value '${email}' for the field '${this.uniqueFieldName}'`,
        });
        return;
      }

      // Check if the role provided is valid
      if (!Object.values(UserRole).includes(role)) {
        res.status(400).json({
          success: false,
          error: "INVALID_ROLE",
          message: `The role '${role}' is not a valid role`,
        });
        return;
      }

      // Create a salt and hash the password
      const salt = randomBytes(32);
      const passwordHash = await argon2.hash(password, { salt });

      // Create the user
      const user = await this.model.create({
        name,
        email,
        salt: salt.toString("hex"),
        passwordHash,
        role,
      });

      res.status(201).json({ success: true, [this.modelName]: user });
    } catch (error) {
      this.handleError(res, error);
    }
  };

  /** Gets the users based on their role */
  public getUsersByRole = async (req: Request, res: Response): Promise<void> => {
    try {
      logger.info(`GET /${this.modelName}s/role/${req.params.role}`);

      // Check if the role provided is valid
      if (!Object.values(UserRole).includes(req.params.role as UserRole)) {
        res.status(400).json({
          success: false,
          error: "INVALID_ROLE",
          message: `The role '${req.params.role}' is not a valid role`,
        });
        return;
      }

      // Get the users
      const users = await this.model.find({ role: req.params.role });

      res.status(200).json({ success: true, length: users.length, [`${this.modelName}s`]: users });
    } catch (error) {
      this.handleError(res, error);
    }
  };

  /** Handles the HTTP request to check if a password is correct for a given user */
  public checkPassword = async (req: Request, res: Response): Promise<void> => {
    logger.info(`POST /${this.modelName}/password ${JSON.stringify({ ...req.body, password: "********" })}`);

    // Check that the request body contains the required fields
    if (!req.body.email || !req.body.password) {
      res.status(400).json({
        success: false,
        error: "MISSING_FIELDS",
        message: "The 'email' and 'password' fields are required",
      });
      return;
    }

    // Find the user in the database
    const { email, password } = req.body;
    const user = await this.model.findOne({ email });

    // Check if the user exists
    if (!user) {
      res.status(404).json({
        success: false,
        error: "USER_NOT_FOUND",
        message: `No user found with the email '${email}'`,
      });
      return;
    }

    // Check if the password is correct
    const salt = Buffer.from(user.salt, "hex");
    const isCorrectPassword = await argon2.verify(user.passwordHash, password, { salt });

    if (!isCorrectPassword) {
      res.status(401).json({
        success: false,
        error: "INVALID_PASSWORD",
        message: "The password is incorrect",
      });
      return;
    }

    res.status(200).json({ success: true });
  };

  /** Processes the HTTP request to update the password for a given user */
  public updatePassword = async (req: Request, res: Response): Promise<void> => {
    logger.info(`PUT /${this.modelName}/password ${JSON.stringify({ ...req.body, password: "********" })}`);
  };
}

export const usersController = new UsersController();
