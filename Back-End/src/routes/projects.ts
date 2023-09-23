import { Router } from "express";
import { getProjects, getProject, addProject, updateProject, deleteProject } from "../controllers/projects";

const projectRouter = Router();

projectRouter.get("/projects", getProjects);
projectRouter.get("/project/:id", getProject);
projectRouter.post("/project", addProject);
projectRouter.put("/project/:id", updateProject);
projectRouter.delete("/project/:id", deleteProject);

export default projectRouter;
