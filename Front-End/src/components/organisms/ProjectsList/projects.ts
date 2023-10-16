// This file contains the type definitions for the Project component.

import axios from "axios";
import { BE_URL } from "../../../utils/utils";

/** Type definition for the equipment used in a project */
type ProjectDevices = {
  _id: string;
  name: string;
  path: string;
  quantity: number;
};

/** Type that represents the project's lead information */
type Lead = {
  name: string;
  email: string;
};

/** Type that represents the project's timelapse */
type Timelapse = {
  start: string;
  end: string;
};

/** Project type definition */
export type Project = {
  _id: string;
  name: string;
  path: string;
  description: string;
  lead: Lead;
  timelapse: Timelapse;
  status: string;
  active: boolean;
  notes: string;
  devices: ProjectDevices[];
};

/** Gets all the projects */
export const getProjects = async (): Promise<Array<Project>> => {
  try {
    const response = await axios.get(`${BE_URL}/projects`);
    response.data.projects.forEach((project: Project) => {
      if (project.status === "In Progress") {
        project.active = true;
      } else {
        project.active = false;
      }
    });
    return response.data.projects as Array<Project>;
  } catch (error) {
    console.log(error);
    return [];
  }
};

/** Fetches equipment data from the server */
export const fetchProject = async (id: string): Promise<Project> => {
  try {
    const response = await axios.get(`${BE_URL}/project/${id}`);
    response.data.project.active =
      response.data.project.status === "In Progress";
    return response.data.project as Project;
  } catch (error) {
    console.log(error);
    return {} as Project;
  }
};

/** Gets the projects filtered by the given name */
export const getFilteredProjects = async (
  name: string
): Promise<Array<Project>> => {
  try {
    const response = await axios.get(
      `${BE_URL}/projects/filtered?name=${name}`
    );
    return response.data.projects as Array<Project>;
  } catch (error) {
    console.log(error);
    return [];
  }
};
