import { Request, Response } from "express";
import { BaseController } from "./BaseController";
import Inquiry from "../models/inquiries";
import Device from "../models/devices";
import { IInquiry } from "../types/inquiry";
import logger from "../utils/logger";

export class InquiriesController extends BaseController<IInquiry> {
  constructor() {
    super(Inquiry, "inquiry");
  }

  public getItems = async (req: Request, res: Response): Promise<void> => {
    logger.info(`GET /inquiries`);

    try {
      const items = await Inquiry.aggregate([
        {
          $lookup: {
            from: "devices",
            localField: "devices.id",
            foreignField: "_id",
            as: "devices",
          },
        },
        {
          $project: {
            projectRequester: 1,
            devices: {
              $map: {
                input: "$devices",
                as: "device",
                in: {
                  id: "$$device._id",
                  name: "$$device.name",
                  quantity: 1,
                  path: "$$device.path",
                },
              },
            },
            projectName: 1,
            courses: 1,
            status: 1,
            createdAt: 1,
            updatedAt: 1,
          },
        },
      ]);

      res.status(200).json({ success: true, length: items.length, inquiries: items });
    } catch (error) {
      this.handleError(res, error);
    }
  };

  public getItem = async (req: Request, res: Response): Promise<void> => {
    logger.info(`GET /inquiry?id=${req.query.id}`);

    try {
      const items = await Inquiry.aggregate([
        {
          $lookup: {
            from: "devices",
            localField: "devices.id",
            foreignField: "_id",
            as: "devices",
          },
        },
        {
          $project: {
            projectRequester: 1,
            devices: {
              $map: {
                input: "$devices",
                as: "device",
                in: {
                  id: "$$device._id",
                  name: "$$device.name",
                  quantity: 1,
                  path: "$$device.path",
                },
              },
            },
            projectName: 1,
            courses: 1,
            status: 1,
            createdAt: 1,
            updatedAt: 1,
          },
        },
      ]);

      const inquiry = items.filter((item) => item._id.toString() === req.query.id)[0];
      res.status(200).json({ success: true, inquiry });
    } catch (error) {
      this.handleError(res, error);
    }
  };

  // Method to check if a device is available
  private checkDeviceAvailability = async (deviceId: string, quantity: number): Promise<boolean> => {
    const device = await Device.findById(deviceId);
    return device ? device.quantity >= quantity : false;
  };

  // Override the createItem method to verify that the amount of devices requested is available
  public createItem = async (req: Request, res: Response): Promise<void> => {
    try {
      const { devices } = req.body;
      let allDevicesAvailable = true;

      // Check if all devices are available
      for (const device of devices) {
        const deviceAvailable = await this.checkDeviceAvailability(device.id, device.quantity);

        if (!deviceAvailable) {
          allDevicesAvailable = false;
          break;
        }
      }

      if (!allDevicesAvailable) {
        res.status(400).json({
          success: false,
          error: "DEVICE_AMOUNT_UNAVAILABLE",
          message: "One or more of the requested devices are unavailable",
        });
        return;
      }

      // Create the inquiry
      const newInquiry = new Inquiry(req.body);
      const inquiry = await newInquiry.save();

      // Return the inquiry
      res.status(201).json({ success: true, inquiry });
    } catch (error) {
      this.handleError(res, error);
    }
  };
}

export const inquiriesController = new InquiriesController();
