import { Request, Response } from "express";
import { BaseController } from "./BaseController";
import Project from "../models/projects";
import Users from "../models/users";
import History from "../models/histories";
import { IProject } from "../types/project";
import logger from "../utils/logger";
import { HistoryEntry, IHistory } from "../types/history";

export class ProjectsController extends BaseController<IProject> {
  constructor() {
    super(Project, "project");
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
   * @param history The history of the project
   * @returns The processed history
   */
  private processHistory = async (history: HistoryEntry[]): Promise<Partial<HistoryEntry>[]> => {
    const modifiedHistory = [];

    for (const entry of history) {
      // Get the name and email of the user who created the history item
      const { userId } = entry;
      const user = await this.getUser(userId);
      const entryData = this.extractHistoryFields(entry);
      delete entryData.projectId;

      const entryCopy = {
        ...entryData,
        user,
        _id: (entry as any)._id,
      };

      modifiedHistory.push(entryCopy);
    }

    return modifiedHistory;
  };

  private async getHistoryEntries(projectID: string): Promise<Partial<HistoryEntry>[]> {
    const historyEntries = await History.find({ projectID: projectID });

    // Also, add the project fields for the history entries that contain them
    const processedHistoryEntries = await this.processHistory(
      historyEntries
        .map((historyEntry: IHistory) => historyEntry.history)
        .flat()
        .sort((a: HistoryEntry, b: HistoryEntry) => a.timestamp.getTime() - b.timestamp.getTime()),
    );

    return processedHistoryEntries;
  }

  public getItems = async (req: Request, res: Response): Promise<void> => {
    logger.info(`GET /projects`);

    try {
      const items = await Project.find().populate({
        path: "devices.id",
        select: "name path",
      });

      const reshapedItems = items.map((item) => {
        const devices = item.devices.map((device) => {
          return {
            ...(device.id as any).toObject(),
            id: (device.id as any)._id,
            quantity: device.quantity,
          };
        });

        return {
          ...item.toObject(),
          devices,
        };
      });

      // Iterate through the projects and retrieve the history entries for each one
      const itemsWithHistory = await Promise.all(
        reshapedItems.map(async (item) => {
          const historyEntries = await this.getHistoryEntries(item._id.toString());
          return { ...item, history: historyEntries };
        }),
      );

      res.status(200).json({ success: true, length: reshapedItems.length, projects: itemsWithHistory });
    } catch (error) {
      this.handleError(res, error);
    }
  };

  // The getFilteredItems method will be overriden to allow for filtering by project name
  public getFilteredItems = async (req: Request, res: Response): Promise<void> => {
    logger.info(`GET /projects/filtered ${JSON.stringify(req.query)}`);

    try {
      const filters: Partial<Record<string, any>> = {};
      for (const [key, value] of Object.entries(req.query)) {
        // If the value is a pipe-delimited string, split it into an array
        const filterValue = typeof value === "string" && value.includes("|") ? value.split("|") : value;
        filters[key] = {
          // Regex to match any string that contains the filter value with case insensitivity
          $regex: `.*${filterValue}.*`,
          $options: "i",
        };
      }

      const items = await Project.find(filters as Record<string, any>).populate({
        path: "devices.id",
        select: "name path",
      });

      const reshapedItems = items.map((item) => {
        const devices = item.devices.map((device) => {
          return {
            ...(device.id as any).toObject(),
            id: (device.id as any)._id,
            quantity: device.quantity,
          };
        });

        return {
          ...item.toObject(),
          devices,
        };
      });

      // Iterate through the projects and retrieve the history entries for each one
      const itemsWithHistory = await Promise.all(
        reshapedItems.map(async (item) => {
          const historyEntries = await this.getHistoryEntries(item._id.toString());
          return { ...item, history: historyEntries };
        }),
      );

      res.status(200).json({ success: true, length: reshapedItems.length, projects: itemsWithHistory });
    } catch (error) {
      this.handleError(res, error);
    }
  };

  public getItem = async (req: Request, res: Response): Promise<void> => {
    logger.info(`GET /project?id=${req.query.id}`);

    try {
      const item = await Project.findById(req.query.id).populate({
        path: "devices.id",
        select: "name path",
      });

      if (item) {
        const reshapedItem = {
          ...item.toObject(),
          devices: item.devices.map((device) => {
            return {
              ...(device.id as any).toObject(),
              id: (device.id as any)._id,
              quantity: device.quantity,
            };
          }),
        };

        // Retrieve the history entries for the project
        const historyEntries = await this.getHistoryEntries(reshapedItem._id.toString());

        res.status(200).json({ success: true, project: { ...reshapedItem, history: historyEntries } });
      } else {
        res.status(404).json({ success: false, error: "NOT_FOUND", message: "Project not found" });
      }
    } catch (error) {
      this.handleError(res, error);
    }
  };

  public getItemByPath = async (req: Request, res: Response): Promise<void> => {
    logger.info(`GET /project/${req.params.path}`);

    try {
      const item = await Project.findOne({ path: `/${req.params.path}` }).populate({
        path: "devices.id",
        select: "name path",
      });
      logger.debug("Found:");
      logger.debug(JSON.stringify(item));

      if (item) {
        const reshapedItem = {
          ...item.toObject(),
          devices: item.devices.map((device) => {
            logger.debug("Device:");
            logger.debug(JSON.stringify(device));
            return {
              ...(device.id as any).toObject(),
              id: (device.id as any)._id,
              quantity: device.quantity,
            };
          }),
        };

        // Retrieve the history entries for the project
        const historyEntries = await this.getHistoryEntries(reshapedItem._id.toString());

        res.status(200).json({ success: true, project: { ...reshapedItem, history: historyEntries } });
      } else {
        res.status(404).json({ success: false, error: "NOT_FOUND", message: "Project not found" });
      }
    } catch (error) {
      this.handleError(res, error);
    }
  };

  public createItem = async (req: Request, res: Response): Promise<void> => {
    logger.info(`POST /${this.modelName} ${JSON.stringify(req.body)}`);

    try {
      const existingProjectsWithSameName = await Project.find({ name: req.body.name });
      const path = `/${req.body.name.toLowerCase().replace(/ /g, "-")}${
        existingProjectsWithSameName.length > 0 ? `-${existingProjectsWithSameName.length}` : ""
      }`;

      const newItem = new this.model({ ...req.body, path });
      const savedItem = await newItem.save();
      res.status(201).json({ success: true, [`new${this.modelName}`]: savedItem });
    } catch (error) {
      this.handleError(res, error);
    }
  };
}

export const projectsController = new ProjectsController();
