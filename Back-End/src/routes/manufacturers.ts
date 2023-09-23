import { Router } from "express";
import { getManufacturers, getManufacturer, addManufacturer, updateManufacturer, deleteManufacturer } from "../controllers/manufacturers";

const manufacturersRouter = Router();

manufacturersRouter.get("/manufacturers", getManufacturers);
manufacturersRouter.get("/manufacturer/:id", getManufacturer);
manufacturersRouter.post("/manufacturer", addManufacturer);
manufacturersRouter.put("/manufacturer/:id", updateManufacturer);
manufacturersRouter.delete("/manufacturer/:id", deleteManufacturer);

export default manufacturersRouter;
