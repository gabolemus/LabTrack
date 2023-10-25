// This file contains the type definitions for the Project component.

import axios from "axios";
import { BE_URL } from "../../../utils/utils";

/** Tag type */
export type ITag = {
  _id: string;
  name: string;
}

/** Gets all the tags */
export const getAllTags = async (): Promise<Array<ITag>> => {
  try {
    const response = await axios.get(`${BE_URL}/tags`);
    return response.data.tags as Array<ITag>;
  } catch (error) {
    console.log(error);
    return [];
  }
};

/** Gets a tag by id */
export const getTagByID = async (id: string): Promise<ITag> => {
  try {
    const response = await axios.get(`${BE_URL}/tag/${id}`);
    return response.data.tag as ITag;
  } catch (error) {
    console.log(error);
    return {} as ITag;
  }
};
