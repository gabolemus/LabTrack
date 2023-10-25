import axios from "axios";
import { Manufacturer } from "../ManufacturersList/manufacturers";
import { BE_URL } from "../../../utils/utils";

/** Enum that defines the possible device statuses */
export enum DeviceStatus {
  AVAILABLE = "Available",
  IN_USE = "In Use",
  MAINTENANCE = "In Maintenance",
  BROKEN = "Broken",
}

/** Interface that represents the device's documentation */
export interface IDocumentation {
  name: string;
  url: string;
}

/** Interface that represents an image with a caption */
export interface IImage {
  caption: string;
  url: string;
}

/** Lab device interface */
export interface Device {
  id: string;
  name: string;
  manufacturerID: string;
  tags: string;
  quantity: number;
  status: DeviceStatus;
  path: string;
  createdAt: Date;
  updatedAt: Date;
  documentation?: IDocumentation[];
  notes?: string;
  configuration?: string;
  images?: IImage[];
}

/** Equipment tag interface */
export interface Tag {
  name: string;
}

/** Gets the manufacturers from the API */
const getManufacturers = async (): Promise<Manufacturer[]> => {
  try {
    const response = await axios.get(`${BE_URL}/manufacturers`);
    const manufacturers = response.data.manufacturers as Manufacturer[];
    return manufacturers;
  } catch (error) {
    console.log(error);
    return [];
  }
};

/** Gets the tags from the API */
const getTags = async (): Promise<Tag[]> => {
  try {
    const response = await axios.get(`${BE_URL}/tags`);
    const tags = response.data.tags as Tag[];
    return tags;
  } catch (error) {
    console.log(error);
    return [];
  }
};

/** Gets and returns and object with all the manufacturers and tags */
export const getManufacturersAndTags = async () => {
  const manufacturers = await getManufacturers();
  const tags = await getTags();
  return { manufacturers, tags };
};