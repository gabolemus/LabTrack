import { Response, Request } from "express";
import { IUser } from "../types/user";
import User from "../models/users";

import logger from "../utils/logger";

/** Gets all the users in the database */
export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    logger.info("getUsers function called");
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
    logger.info("getUser function called");
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
    logger.info("addUser function called");

    // Get the body of the request
    const body = req.body as Pick<IUser, "name" | "email" | "salt" | "passwordHash" | "role">;
    let user: IUser = new User({
      name: body.name,
      email: body.email,
      salt: body.salt,
      passwordHash: body.passwordHash,
      role: body.role,
    });

    // Check if the name of the user can be used as its ID
    const userName = user.name.replace(/\s+/g, "_").toLowerCase();

    // Check if the user ID already exists
    let userID = userName;
    let userIDExists = await User.exists({ id: userID });
    while (userIDExists) {
      userID = `${userName}_${Math.floor(Math.random() * 100)}`;
      userIDExists = await User.exists({ id: userID });
    }
    if (userID !== userName) {
      user.id = userID;
    } else {
      user.id = `${userName}-${userID}`;
    }

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
    logger.info("updateUser function called");
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
    logger.info("deleteUser function called");
    const user: IUser | null = await User.findByIdAndDelete(req.params.id);
    res.status(user ? 200 : 404).json({ success: true, user });
  } catch (error) {
    logger.error(`An error occured trying to delete the user with ID ${req.params.id}: ${error}`);
    throw error;
  }
};
