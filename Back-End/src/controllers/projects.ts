import { Request, Response } from "express";
import { BaseController } from "./BaseController";
import Project from "../models/projects";
import { IProject } from "../types/project";
import logger from "../utils/logger";

export class ProjectsController extends BaseController<IProject> {
  constructor() {
    super(Project, "project");
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
            quantity: device.quantity,
          };
        });

        return {
          ...item.toObject(),
          devices,
        };
      });

      res.status(200).json({ success: true, length: reshapedItems.length, projects: reshapedItems });
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
            quantity: device.quantity,
          };
        });

        return {
          ...item.toObject(),
          devices,
        };
      });

      res.status(200).json({ success: true, length: reshapedItems.length, projects: reshapedItems });
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
              quantity: device.quantity,
            };
          }),
        };

        res.status(200).json({ success: true, project: reshapedItem });
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

      if (item) {
        const reshapedItem = {
          ...item.toObject(),
          devices: item.devices.map((device) => {
            return {
              ...(device.id as any).toObject(),
              quantity: device.quantity,
            };
          }),
        };

        res.status(200).json({ success: true, project: reshapedItem });
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
