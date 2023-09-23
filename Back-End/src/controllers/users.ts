import { Response, Request } from "express";
import { IUser } from "../types/user";
import User from "../models/users";
import logger from "../utils/logger";

/** Gets all the users in the database */
export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    logger.info("GET /users");
    const users: IUser[] = await User.find();
    res.status(200).json({ success: true, users });
  } catch (error) {
    logger.error(`An error occured trying to get all the users: ${error}`);
    throw error;
  }
};

/** Gets a user by its ID */
export const getUser = async (req: Request, res: Response): Promise<void> => {
  try {
    logger.info("GET /user/:id");
    const user: IUser | null = await User.findById(req.params.id);
    res.status(user ? 200 : 404).json({ success: true, user });
  } catch (error) {
    logger.error(`An error occured trying to get the user with ID ${req.params.id}: ${error}`);
    throw error;
  }
};

/** Creates a new user */
export const addUser = async (req: Request, res: Response): Promise<void> => {
  try {
    logger.info("POST /user");

    // Get the body of the request
    const body = req.body as Pick<IUser, "name" | "email" | "salt" | "passwordHash" | "role">;
    let user: IUser = new User({
      name: body.name,
      email: body.email,
      salt: body.salt,
      passwordHash: body.passwordHash,
      role: body.role,
    });

    // Save the user
    const newUser: IUser = await user.save();
    res.status(201).json({ success: true, user: newUser });
  } catch (error) {
    logger.error(`An error occured trying to create a new user: ${error}`);
    throw error;
  }
};

/** Updates a user by its ID */
export const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    logger.info("PUT /user/:id");
    const user: IUser | null = await User.findByIdAndUpdate(req.params.id, req.body);
    res.status(user ? 200 : 404).json({ success: true, user });
  } catch (error) {
    logger.error(`An error occured trying to update the user with ID ${req.params.id}: ${error}`);
    throw error;
  }
};

/** Deletes a user by its ID */
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    logger.info("DELETE /user/:id");
    const user: IUser | null = await User.findByIdAndDelete(req.params.id);
    res.status(user ? 200 : 404).json({ success: true, user });
  } catch (error) {
    logger.error(`An error occured trying to delete the user with ID ${req.params.id}: ${error}`);
    throw error;
  }
};
