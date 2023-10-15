import { Router } from "express";
import { historiesController } from "../controllers/histories";

const historyRouter = Router();

historyRouter.get("/histories", historiesController.getItems);
historyRouter.get("/history", historiesController.getItem);
historyRouter.post("/history", historiesController.createItem);
historyRouter.put("/history", historiesController.updateItem);
historyRouter.delete("/history", historiesController.deleteItem);
historyRouter.delete("/all-histories", historiesController.deleteAllItems);

export default historyRouter;
