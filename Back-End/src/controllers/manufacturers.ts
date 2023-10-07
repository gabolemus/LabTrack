import { Request, Response } from "express";
import { BaseController } from "./BaseController";
import Manufacturer from "../models/manufacturers";
import { IManufacturer } from "../types/manufacturer";
import logger from "../utils/logger";

export class ManufacturersController extends BaseController<IManufacturer> {
  constructor() {
    super(Manufacturer, "manufacturer", "name", true);
  }

  // Method to update manufacturers in bulk
  // It also checks that each manufacturer's name is unique
  public updateItemsInBulk = async (req: Request, res: Response): Promise<void> => {
    logger.info(`PUT /manufacturers`);

    try {
      const { manufacturers } = req.body;

      // Check that each manufacturer's name is unique
      const names = manufacturers.map((manufacturer: IManufacturer) => manufacturer.name);
      const uniqueNames = [...new Set(names)];
      if (names.length !== uniqueNames.length) {
        const nonUniqueName = names.find((name: string) => names.indexOf(name) !== names.lastIndexOf(name));
        res.status(400).json({ success: false, error: "ENFORCE_UNIQUE_FIELD", message: "Each manufacturer's name must be unique", nonUniqueName });
        return;
      }

      // Update manufacturers
      const updatedManufacturers = await Promise.all(
        manufacturers.map(async (manufacturer: IManufacturer) => {
          const { _id, name } = manufacturer;
          const updatedManufacturer = await Manufacturer.findByIdAndUpdate(_id, { name }, { new: true });
          return updatedManufacturer;
        }),
      );

      res.status(200).json({ success: true, length: updatedManufacturers.length, manufacturers: updatedManufacturers });
    } catch (error) {
      this.handleError(res, error);
    }
  };
}

export const manufacturersController = new ManufacturersController();
