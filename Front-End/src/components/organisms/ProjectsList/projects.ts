// This file contains the type definitions for the Project component.

import axios from "axios";

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
    const response = await axios.get("http://20.163.78.89:8080/projects");
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
    const response = await axios.get(`http://20.163.78.89:8080/project/${id}`);
    response.data.project.active =
      response.data.project.status === "In Progress";
    return response.data.project as Project;
  } catch (error) {
    console.log(error);
    return {} as Project;
  }
};
