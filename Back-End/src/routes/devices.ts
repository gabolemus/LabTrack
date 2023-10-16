import { Router } from "express";
import { devicesController } from "../controllers/devices";

const devicesRouter = Router();

devicesRouter.get("/devices", devicesController.getItems);
devicesRouter.get("/devices/filtered", devicesController.getFilteredItems);
devicesRouter.get("/device", devicesController.getItem);
devicesRouter.get("/device/:path", devicesController.getItemByPath);
devicesRouter.post("/device", devicesController.createItem);
devicesRouter.put("/device", devicesController.updateItem);
devicesRouter.delete("/device", devicesController.deleteItem);
devicesRouter.delete("/all-devices", devicesController.deleteAllItems);

export default devicesRouter;
