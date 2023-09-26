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
}

export const projectsController = new ProjectsController();
