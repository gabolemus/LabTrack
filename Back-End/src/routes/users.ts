import { Router } from "express";
import { getUsers, getUser, addUser, updateUser, deleteUser } from "../controllers/users";

const usersRouter = Router();

usersRouter.get("/users", getUsers);
usersRouter.get("/user/:id", getUser);
usersRouter.post("/user", addUser);
usersRouter.put("/user/:id", updateUser);
usersRouter.delete("/user/:id", deleteUser);

export default usersRouter;
