import { Router } from "express";
import { tagsController } from "../controllers/tags";

const tagsRouter = Router();

tagsRouter.get("/tags", tagsController.getItems);
tagsRouter.get("/tag", tagsController.getItem);
tagsRouter.post("/tag", tagsController.createItem);
tagsRouter.put("/tag", tagsController.updateItem);
tagsRouter.put("/tags", tagsController.updateItemsInBulk);
tagsRouter.delete("/tag", tagsController.deleteItem);
tagsRouter.delete("/all-tags", tagsController.deleteAllItems);

export default tagsRouter;
