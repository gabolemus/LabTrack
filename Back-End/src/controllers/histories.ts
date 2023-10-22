import { Request, Response } from "express";
import { BaseController } from "./BaseController";
import Histories from "../models/histories";
import Projects from "../models/projects";
import Users from "../models/users";
import { IHistory, HistoryEntry } from "../types/history";
import logger from "../utils/logger";

export class HistoryItemsController extends BaseController<IHistory> {
  constructor() {
    super(Histories, "history");
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
   * Processes the history of a history item.
   * @param history The history of an equipment
   * @returns The processed history
   */
  private processHistoryWithProjectPath = async (history: HistoryEntry[]): Promise<Partial<HistoryEntry>[]> => {
    const modifiedHistory = [];

    for (const entry of history) {
      if (entry.projectId) {
        const project = await Projects.findById(entry.projectId);

        // If the project exists, add the "path" value to the history entry
        if (project) {
          const entryData = this.extractHistoryFields(entry);
          delete entryData.projectId;

          const entryCopy = {
            ...entryData,
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
        modifiedHistory.push(entry);
      }
    }

    return modifiedHistory;
  };

  /**
   * Gets the user with the given ID.
   * @param userId The ID of the user
   * @returns The user
   */
  private getUser = async (userId: string) => {
    const user = await Users.findById(userId);
    return { name: user?.name, email: user?.email };
  }

  public getItems = async (req: Request, res: Response): Promise<void> => {
    try {
      const pluralModelName = this.getPluralName();
      logger.info(`GET /${pluralModelName}`);
      const items = await this.model.find();

      // Process history entries with projectPath for each item
      const itemsWithHistory = await Promise.all(
        items.map(async (item) => {
          const modifiedHistory = await this.processHistoryWithProjectPath(item.history || []);
          return { ...item.toObject(), history: modifiedHistory };
        }),
      );

      // Add the name and email of the user who created the history item
      const itemsWithUser = await Promise.all(
        itemsWithHistory.map(async (item) => {
          const { userId } = item.history[0];
          const user = await this.getUser(userId);
          return { ...item, history: [{ ...item.history[0], user }] };
        }),
      );
      logger.debug(itemsWithUser);

      res.status(200).json({ success: true, length: items.length, [pluralModelName]: itemsWithHistory });
      // res.status(200).json({ success: true, length: items.length, [pluralModelName]: itemsWithUser });
    } catch (error) {
      this.handleError(res, error);
    }
  };

  public getItem = async (req: Request, res: Response): Promise<void> => {
    try {
      logger.info(`GET /${this.modelName}?id=${req.query.id}`);
      const item = await this.model.findById(req.query.id);

      if (!item) {
        res.status(404).json({ success: false, message: "Item not found" });
        return;
      }

      // Process history entries with projectPath
      const modifiedHistory = await this.processHistoryWithProjectPath(item.history || []);

      res.status(200).json({ success: true, [this.modelName]: { ...item.toObject(), history: modifiedHistory } });
    } catch (error) {
      this.handleError(res, error);
    }
  };

  /**
   * Create a new history item.
   *
   * It also checks if an item with the same equipmentID value already exists.
   * If it does, it adds the new history entry to the history array.
   */
  public createItem = async (req: Request, res: Response): Promise<void> => {
    try {
      logger.info(`POST /${this.modelName} ${JSON.stringify(req.body)}`);

      const { equipmentId, history } = req.body;
      const [{ change, timestamp, description, userId, projectId }] = history as HistoryEntry[];
      const currentTimestamp = new Date();

      // Use the Histories model to check if a document with the same equipmentId value already exists
      const existingHistory = await Histories.findOne({ equipmentId });

      if (existingHistory) {
        // If it does, add the new history entry to the history array
        existingHistory.history.push({
          change,
          timestamp: timestamp || currentTimestamp,
          description,
          userId,
          projectId,
        });
        await existingHistory.save();
        res.status(200).json({ success: true, history: existingHistory });
      } else {
        // If it doesn't, create a new history item
        const newItem = await this.model.create({
          equipmentId,
          history: [
            {
              change,
              timestamp: timestamp || currentTimestamp,
              description,
              userId,
              projectId,
            },
          ],
        });
        res.status(201).json({ success: true, history: newItem });
      }
    } catch (error) {
      this.handleError(res, error);
    }
  };
}

export const historiesController = new HistoryItemsController();
