import { Request, Response } from "express";
import { BaseController } from "./BaseController";
import Device from "../models/devices";
import History from "../models/histories";
import Projects from "../models/projects";
import Users from "../models/users";
import { IDevice } from "../types/device";
import logger from "../utils/logger";
import { HistoryEntry, IHistory } from "../types/history";

export class DevicesController extends BaseController<IDevice> {
  constructor() {
    super(Device, "device", "name", true);
  }

  /**
   * Extracts the fields that are needed for the history item from the history entry.
   * @param entry The history entry
   * @returns The extracted fields as a partial history entry
   */
  private extractHistoryFields(entry: HistoryEntry): Partial<HistoryEntry> {
    const { change, timestamp, description, projectId } = entry;
    return { change, timestamp, description, projectId };
  }

  /**
   * Gets the name and email of the user who created the history item.
   * @param userId The ID of the user
   * @returns The name and email of the user
   */
  private async getUser(userId: string) {
    const user = await Users.findById(userId);
    return { name: user?.name, email: user?.email };
  }

  /**
   * Processes the history of a history item.
   * @param history The history of an equipment
   * @returns The processed history
   */
  private processHistoryWithProjectPath = async (history: HistoryEntry[]): Promise<Partial<HistoryEntry>[]> => {
    const modifiedHistory = [];

    for (const entry of history) {
      // Get the name and email of the user who created the history item
      const { userId } = entry;
      const user = await this.getUser(userId);
      const entryData = this.extractHistoryFields(entry);
      delete entryData.projectId;

      if (entry.projectId) {
        const project = await Projects.findById(entry.projectId);

        // If the project exists, add the "path" value to the history entry
        if (project) {
          const entryCopy = {
            ...entryData,
            user,
            project: {
              name: project.name,
              path: project.path,
              timelapse: project.timelapse,
            },
            _id: (entry as any)._id,
          };

          modifiedHistory.push(entryCopy);
        }
      } else {
        // If the history entry doesn't have a "projectId" value, add it to the modified history array
        const entryCopy = {
          ...entryData,
          user,
          _id: (entry as any)._id,
        };

        modifiedHistory.push(entryCopy);
      }
    }

    return modifiedHistory;
  };

  private async getHistoryEntries(deviceId: string): Promise<Partial<HistoryEntry>[]> {
    const historyEntries = await History.find({ equipmentId: deviceId });

    // Also, add the project fields for the history entries that contain them
    const processedHistoryEntries = await this.processHistoryWithProjectPath(
      historyEntries
        .map((historyEntry: IHistory) => historyEntry.history)
        .flat()
        .sort((a: HistoryEntry, b: HistoryEntry) => a.timestamp.getTime() - b.timestamp.getTime()),
    );

    return processedHistoryEntries;
  }

  public getItems = async (req: Request, res: Response): Promise<void> => {
    try {
      const pluralModelName = this.getPluralName();
      logger.info(`GET /${pluralModelName}`);

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

      // Iterate through the devices and retrieve the history entries for each one
      const itemsWithHistory = await Promise.all(
        items.map(async (item) => {
          const historyEntries = await this.getHistoryEntries(item._id.toString());
          return {
            ...item,
            history: historyEntries,
          };
        }),
      );

      // res.status(200).json({ success: true, length: items.length, [`${this.modelName}s`]: items });
      res.status(200).json({ success: true, length: itemsWithHistory.length, [pluralModelName]: itemsWithHistory });
    } catch (error) {
      this.handleError(res, error);
    }
  };

  public getFilteredItems = async (req: Request, res: Response): Promise<void> => {
    try {
      logger.info(`GET /${this.modelName}/filtered?name=${req.query.name}`);
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

      // Filter the array to only return the devices that contain the specified name
      const filteredItems = items.filter((item) => item.name.toLowerCase().includes((req.query.name as string).toLowerCase()));

      // Iterate through the devices and retrieve the history entries for each one
      const filteredItemsWithHistory = await Promise.all(
        filteredItems.map(async (item) => {
          const historyEntries = await this.getHistoryEntries(item._id.toString());
          return {
            ...item,
            history: historyEntries,
          };
        }),
      );

      res.status(200).json({ success: true, length: filteredItemsWithHistory.length, [`${this.modelName}s`]: filteredItemsWithHistory });
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

      // Show the projects that use this device
      const projects = await Device.db.db
        .collection("projects")
        .aggregate([
          {
            $unwind: "$devices",
          },
          {
            $match: {
              "devices.id": item._id,
            },
          },
          {
            $project: {
              _id: 1,
              name: 1,
              path: 1,
              quantity: "$devices.quantity",
            },
          },
        ])
        .toArray();
      item.projects = projects;

      if (!item || item.length === 0) {
        res.status(404).json({ success: false, message: "Item not found" });
        return;
      }

      // Retrieve the history entries for the device and add them to the response
      const historyEntries = await this.getHistoryEntries(item._id.toString());
      const deviceWithHistory = {
        ...item,
        history: historyEntries,
      };

      res.status(200).json({ success: true, [this.modelName]: deviceWithHistory });
    } catch (error) {
      this.handleError(res, error);
    }
  };

  public getItemByPath = async (req: Request, res: Response): Promise<void> => {
    try {
      logger.info(`GET /${this.modelName}/${req.params.path}`);
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

      // Filter the array to only return the device with the specified path
      const item = items.filter((item) => item.path === `/${req.params.path}`)[0];

      // Show the projects that use this device
      const projects = await Device.db.db
        .collection("projects")
        .aggregate([
          {
            $unwind: "$devices",
          },
          {
            $match: {
              "devices.id": item._id,
            },
          },
          {
            $project: {
              _id: 1,
              name: 1,
              path: 1,
              quantity: "$devices.quantity",
            },
          },
        ])
        .toArray();
      item.projects = projects;

      if (!item || item.length === 0) {
        res.status(404).json({ success: false, message: "Item not found" });
        return;
      }

      // Retrieve the history entries for the device and add them to the response
      const historyEntries = await this.getHistoryEntries(item._id.toString());
      const deviceWithHistory = {
        ...item,
        history: historyEntries,
      };

      res.status(200).json({ success: true, [this.modelName]: deviceWithHistory });
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

      // // Encode the URLs for the images
      // if (req.body.images) {
      //   req.body.images = req.body.images.map((image: string) => encodeURI(image));
      // }

      // Create the device
      const newDevice = new this.model(req.body);
      const savedDevice = await newDevice.save();
      res.status(201).json({ success: true, [`new${this.modelName}`]: savedDevice });
    } catch (error) {
      this.handleError(res, error);
    }
  };

  public updateItem = async (req: Request, res: Response): Promise<void> => {
    logger.info(`PUT fdfdsa /${this.modelName} ${JSON.stringify(req.body)}`);

    try {
      // Encode the URLs for the images
      if (req.body.images) {
        req.body.images = req.body.images.map((image: string) => encodeURI(image));
      }

      const updatedItem = await this.model.findByIdAndUpdate(req.query.id, req.body);
      res.status(updatedItem ? 200 : 404).json({ success: true, [this.modelName]: updatedItem });
    } catch (error) {
      this.handleError(res, error);
    }
  };
}

export const devicesController = new DevicesController();
