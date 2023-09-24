import { BaseController } from "./BaseController";
import Manufacturer from "../models/manufacturers";
import { IManufacturer } from "../types/manufacturer";

export class ManufacturersController extends BaseController<IManufacturer> {
  constructor() {
    super(Manufacturer, "manufacturer");
  }
}

export const manufacturersController = new ManufacturersController();
