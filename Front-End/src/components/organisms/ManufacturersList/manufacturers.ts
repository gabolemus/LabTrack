// This file contains the type definitions for the Project component.

import axios from "axios";
import { BE_URL } from "../../../utils/utils";

/** Manufacturer type definition */
export type Manufacturer = {
  _id: string;
  name: string;
};

/** Gets all the manufacturers */
export const getAllManufacturers = async (): Promise<Array<Manufacturer>> => {
  try {
    const response = await axios.get(`${BE_URL}/manufacturers`);
    return response.data.manufacturers as Array<Manufacturer>;
  } catch (error) {
    console.log(error);
    return [];
  }
};

/** Gets a manufacturer by id */
export const getManufacturerByID = async (id: string): Promise<Manufacturer> => {
  try {
    const response = await axios.get(`${BE_URL}/manufacturer/${id}`);
    return response.data.manufacturer as Manufacturer;
  } catch (error) {
    console.log(error);
    return {} as Manufacturer;
  }
};
