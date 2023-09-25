import { Router } from "express";
import { usersController } from "../controllers/users";

const usersRouter = Router();

usersRouter.get("/users", usersController.getItems);
usersRouter.get("/user", usersController.getItem);
usersRouter.post("/user", usersController.createItem);
usersRouter.put("/user", usersController.updateItem);
usersRouter.delete("/user", usersController.deleteItem);
usersRouter.delete("/all-users", usersController.deleteAllItems);

export default usersRouter;
