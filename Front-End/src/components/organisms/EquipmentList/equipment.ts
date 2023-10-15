import axios from "axios";

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
  images?: string[];
  notes?: string;
  configuration?: string;
  status: string;
  updatedAt: string;
};

/** Sample equipment data */
export const sampleEquipmentData: Equipment[] = [];

/** Get all the devices from the server */
export const getAllEquipment = async (): Promise<Array<Equipment>> => {
  try {
    const response = await axios.get("http://20.163.78.89:8080/devices");
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
    const response = await axios.get(`http://20.163.78.89:8080/device/${id}`);
    const device = response.data.device as Equipment;
    return device;
  } catch (error) {
    console.log(error);
    return {} as Equipment;
  }
};
