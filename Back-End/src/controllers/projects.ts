import { BaseController } from "./BaseController";
import Project from "../models/projects";
import { IProject } from "../types/project";

export class ProjectsController extends BaseController<IProject> {
  constructor() {
    super(Project, "project");
  }
}

export const projectsController = new ProjectsController();
