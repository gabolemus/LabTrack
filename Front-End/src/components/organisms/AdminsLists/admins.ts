// This file contains the type definitions for the Project component.

import axios from "axios";
import { BE_URL } from "../../../utils/utils";

/** User type definition */
export type User = {
  _id: string;
  name: string;
  email: string;
  role: string;
};

/** Gets all the users */
export const getAllUsers = async (): Promise<Array<User>> => {
  try {
    const response = await axios.get(`${BE_URL}/users`);
    return response.data.users as Array<User>;
  } catch (error) {
    console.log(error);
    return [];
  }
};

/** Gets a user by id */
export const getUserByID = async (id: string): Promise<User> => {
  try {
    const response = await axios.get(`${BE_URL}/user/${id}`);
    return response.data.user as User;
  } catch (error) {
    console.log(error);
    return {} as User;
  }
};

/** Gets all the users filtered by their role */
export const getFilteredUsers = async (): Promise<
  Record<string, Array<User>>
> => {
  try {
    const response = await axios.get(`${BE_URL}/filtered-users`);
    return response.data.users as Record<string, Array<User>>;
  } catch (error) {
    console.log(error);
    return {};
  }
};
