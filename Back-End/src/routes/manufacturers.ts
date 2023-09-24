import { Router } from "express";
import { manufacturersController } from "../controllers/manufacturers";

const manufacturersRouter = Router();

manufacturersRouter.get("/manufacturers", manufacturersController.getItems);
manufacturersRouter.get("/manufacturer", manufacturersController.getItem);
manufacturersRouter.post("/manufacturer", manufacturersController.createItem);
manufacturersRouter.put("/manufacturer", manufacturersController.updateItem);
manufacturersRouter.delete("/manufacturer", manufacturersController.deleteItem);

export default manufacturersRouter;
