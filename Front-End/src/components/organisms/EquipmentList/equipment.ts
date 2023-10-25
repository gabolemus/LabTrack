import axios from "axios";
import { BE_URL } from "../../../utils/utils";

// This file contains the type definitions for the Equipment component.

/** Type definition for a documentation link */
export type DocumentationLink = {
  name: string;
  url: string;
};

/** Type that defines the projects a device has been used in */
export type Project = {
  name: string;
  path: string;
  quantity: number;
};

/** Type that defines the images a device has */
export type Image = {
  caption: string;
  url: string;
  delete?: boolean;
  new?: boolean;
};

/** Enum that represents the possible history changes of a lab device */
export enum HistoryChange {
  CREATED = "created",
  UPDATED = "updated",
  USED_IN_PROJECT = "used in project",
}

/** Type that defines the history of a device */
export type HistoryEntry = {
  _id: string,
  change: HistoryChange,
  timestamp: Date,
  description: string,
  user: {
    name: string,
    email: string,
  },
};

/** Equipment type definition */
export type Equipment = {
  _id: string;
  name: string;
  manufacturer: string;
  tags: string[];
  quantity: number;
  path: string;
  projects: Project[];
  documentation?: DocumentationLink[];
  images?: Image[];
  notes?: string;
  configuration?: string;
  history: HistoryEntry[];
  status: string;
  updatedAt: string;
};

/** Sample equipment data */
export const sampleEquipmentData: Equipment[] = [];

/** Get all the devices from the server */
export const getAllEquipment = async (): Promise<Array<Equipment>> => {
  try {
    const response = await axios.get(`${BE_URL}/devices`);
    const devices = response.data.devices as Array<Equipment>;
    return devices;
  } catch (error) {
    console.log(error);
    return [];
  }
};

/** Fetches equipment data from the server */
export const fetchEquipmentData = async (id: string): Promise<Equipment> => {
  try {
    const response = await axios.get(`${BE_URL}/device/${id}`);
    const device = response.data.device as Equipment;
    return device;
  } catch (error) {
    console.log(error);
    return {} as Equipment;
  }
};

/** Gets the equipment filtered by the given name */
export const getFilteredEquipment = async (
  name: string,
): Promise<Array<Equipment>> => {
  try {
    const response = await axios.get(
      `${BE_URL}/devices/filtered?name=${name}`
    );
    return response.data.devices as Array<Equipment>;
  } catch (error) {
    console.log(error);
    return [];
  }
};
