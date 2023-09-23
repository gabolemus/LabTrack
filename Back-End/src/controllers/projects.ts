import { Response, Request } from "express";
import { IProject } from "../types/project";
import Project from "../models/projects";
import logger from "../utils/logger";

/** Gets all the projects in the database */
export const getProjects = async (req: Request, res: Response): Promise<void> => {
  try {
    logger.info("GET /projects");
    const projects: IProject[] = await Project.find();
    res.status(200).json({ success: true, projects });
  } catch (error) {
    logger.error(`An error occured trying to get all the projects: ${error}`);
    throw error;
  }
};

/** Gets a project by its ID */
export const getProject = async (req: Request, res: Response): Promise<void> => {
  try {
    logger.info("GET /project/:id");
    const project: IProject | null = await Project.findById(req.params.id);
    res.status(project ? 200 : 404).json({ success: true, project });
  } catch (error) {
    logger.error(`An error occured trying to get the project with ID ${req.params.id}: ${error}`);
    throw error;
  }
};

/** Creates a new project */
export const addProject = async (req: Request, res: Response): Promise<void> => {
  try {
    logger.info("POST /project");

    // Get the body of the request
    const body = req.body as Pick<IProject, "name" | "courses" | "description" | "lead" | "timelapse" | "status" | "notes" | "equipment">;
    let project: IProject = new Project({
      name: body.name,
      courses: body.courses,
      description: body.description,
      lead: body.lead,
      timelapse: body.timelapse,
      status: body.status,
      notes: body.notes,
      equipment: body.equipment,
    });

    // Check if the name of the project can be used as its ID
    const projectName = project.name.replace(/\s+/g, "_").toLowerCase();

    // Check if the project ID already exists
    let projectID = projectName;
    let projectIDExists = await Project.exists({ id: projectID });
    while (projectIDExists) {
      projectID = `${projectName}_${Math.floor(Math.random() * 100)}`;
      projectIDExists = await Project.exists({ id: projectID });
    }
    if (projectID !== projectName) {
      project.id = projectID;
    } else {
      project.id = `${projectName}-${projectID}`;
    }

    // Save the project
    const newProject: IProject = await project.save();
    res.status(201).json({ success: true, project: newProject });
  } catch (error) {
    logger.error(`An error occured trying to create a new project: ${error}`);
    throw error;
  }
};

/** Updates a project by its ID */
export const updateProject = async (req: Request, res: Response): Promise<void> => {
  try {
    logger.info("PUT /project/:id");
    const project: IProject | null = await Project.findByIdAndUpdate(req.params.id, req.body);
    res.status(project ? 200 : 404).json({ success: true, project });
  } catch (error) {
    logger.error(`An error occured trying to update the project with ID ${req.params.id}: ${error}`);
    throw error;
  }
};

/** Deletes a project by its ID */
export const deleteProject = async (req: Request, res: Response): Promise<void> => {
  try {
    logger.info("DELETE /project/:id");
    const project: IProject | null = await Project.findByIdAndRemove(req.params.id);
    res.status(project ? 200 : 404).json({ success: true, project });
  } catch (error) {
    logger.error(`An error occured trying to delete the project with ID ${req.params.id}: ${error}`);
    throw error;
  }
};
