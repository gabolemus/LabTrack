import { Router } from "express";
import { projectsController } from "../controllers/projects";

const projectRouter = Router();

projectRouter.get("/projects", projectsController.getItems);
projectRouter.get("/project", projectsController.getItem);
projectRouter.post("/project", projectsController.createItem);
projectRouter.put("/project", projectsController.updateItem);
projectRouter.delete("/project", projectsController.deleteItem);

export default projectRouter;
