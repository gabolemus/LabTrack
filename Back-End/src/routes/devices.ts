import { Router } from "express";
import { getDevices, getDevice, addDevice, updateDevice, deleteDevice } from "../controllers/devices";

const devicesRouter = Router();

devicesRouter.get("/devices", getDevices);
devicesRouter.get("/device/:id", getDevice);
devicesRouter.post("/device", addDevice);
devicesRouter.put("/device/:id", updateDevice);
devicesRouter.delete("/device/:id", deleteDevice);

export default devicesRouter;
