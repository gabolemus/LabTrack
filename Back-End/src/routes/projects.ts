import { Router } from "express";
import { projectsController } from "../controllers/projects";

const projectsRouter = Router();

projectsRouter.get("/projects", projectsController.getItems);
projectsRouter.get("/project", projectsController.getItem);
projectsRouter.get("/projects/filtered", projectsController.getFilteredItems);
projectsRouter.get("/project/:path", projectsController.getItemByPath);
projectsRouter.post("/project", projectsController.createItem);
projectsRouter.put("/project", projectsController.updateItem);
projectsRouter.delete("/project", projectsController.deleteItem);
projectsRouter.delete("/all-projects", projectsController.deleteAllItems);

export default projectsRouter;
