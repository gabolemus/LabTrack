import { Request, Response } from "express";
import { BaseController } from "./BaseController";
import Project from "../models/projects";
import { IProject } from "../types/project";
import logger from "../utils/logger";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";

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
