import { Request, Response } from "express";
import { BaseController } from "./BaseController";
import Device from "../models/devices";
import { IDevice } from "../types/device";
import logger from "../utils/logger";

export class DevicesController extends BaseController<IDevice> {
  constructor() {
    super(Device, "device", "name", true);
  }

  public getItems = async (req: Request, res: Response): Promise<void> => {
    try {
      logger.info(`GET /${this.modelName}s`);
      // TODO: refactor this aggregate into a separate function
      const items = await Device.db.db
        .collection("devices")
        .aggregate([
          {
            $lookup: {
              from: "manufacturers",
              localField: "manufacturerID",
              foreignField: "_id",
              as: "manufacturer",
            },
          },
          {
            $unwind: "$manufacturer",
          },
          {
            $project: {
              _id: 1,
              name: 1,
              manufacturer: "$manufacturer.name",
              tags: 1,
              quantity: 1,
              status: 1,
              path: 1,
              createdAt: 1,
              updatedAt: 1,
              documentation: 1,
              configuration: 1,
              images: 1,
            },
          },
        ])
        .toArray();
      res.status(200).json({ success: true, length: items.length, [`${this.modelName}s`]: items });
    } catch (error) {
      this.handleError(res, error);
    }
  };

  public getItem = async (req: Request, res: Response): Promise<void> => {
    try {
      logger.info(`GET /${this.modelName}?id=${req.query.id}`);
      const items = await Device.db.db
        .collection("devices")
        .aggregate([
          {
            $lookup: {
              from: "manufacturers",
              localField: "manufacturerID",
              foreignField: "_id",
              as: "manufacturer",
            },
          },
          {
            $unwind: "$manufacturer",
          },
          {
            $project: {
              _id: 1,
              name: 1,
              manufacturer: "$manufacturer.name",
              tags: 1,
              quantity: 1,
              status: 1,
              path: 1,
              createdAt: 1,
              updatedAt: 1,
              documentation: 1,
              configuration: 1,
              images: 1,
            },
          },
        ])
        .toArray();

      // Filter the array to only return the device with the specified ID
      const item = items.filter((item) => item._id.toString() === req.query.id)[0];

      res.status(item ? 200 : 404).json({ success: true, [this.modelName]: item });
    } catch (error) {
      this.handleError(res, error);
    }
  };

  public createItem = async (req: Request, res: Response): Promise<void> => {
    try {
      logger.info(`POST /${this.modelName} ${JSON.stringify(req.body)}`);

      // Check if an item with the same uniqueField value already exists
      const filterQuery: Partial<Record<string, any>> = {};
      filterQuery[this.uniqueFieldName] = req.body[this.uniqueFieldName];
      const existingItem = await this.model.findOne(filterQuery);

      if (existingItem) {
        res.status(400).json({
          success: false,
          error: "ENFORCE_UNIQUE_FIELD",
          message: `An entry in the ${this.modelName}s collection already exists with the value '${req.body[this.uniqueFieldName]}' for the field '${
            this.uniqueFieldName
          }'`,
        });
        return;
      }

      // Check if the name of the manufacturer provided is valid
      const manufacturer = await Device.db.db.collection("manufacturers").findOne({ name: req.body.manufacturer });
      if (!manufacturer) {
        res.status(400).json({
          success: false,
          message: `The manufacturer ${req.body.manufacturer} does not exist`,
        });
        return;
      }

      // Add the manufacturerId field to the request body
      req.body.manufacturerID = manufacturer._id;

      // Make the name of the device in lowercase and changing whitespaces to hyphens its path
      req.body.path = "/" + req.body.name.toLowerCase().replace(/\s/g, "-");

      // Create the device
      const newDevice = new this.model(req.body);
      const savedDevice = await newDevice.save();
      res.status(201).json({ success: true, [`new${this.modelName}`]: savedDevice });
    } catch (error) {
      this.handleError(res, error);
    }
  };
}

export const devicesController = new DevicesController();
