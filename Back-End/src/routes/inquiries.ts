import { Router } from "express";
import { inquiriesController } from "../controllers/inquiries";

const inquiriesRouter = Router();

inquiriesRouter.get("/inquiries", inquiriesController.getItems);
inquiriesRouter.get("/inquiry", inquiriesController.getItem);
inquiriesRouter.post("/inquiry", inquiriesController.createItem);
inquiriesRouter.put("/inquiry", inquiriesController.updateItem);
inquiriesRouter.delete("/inquiry", inquiriesController.deleteItem);

export default inquiriesRouter;
