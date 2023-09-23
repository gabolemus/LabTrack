import { Response, Request } from "express";
import { IDevice } from "../types/device";
import Device from "../models/devices";
import logger from "../utils/logger";

/** Gets all the devices in the database */
export const getDevices = async (req: Request, res: Response): Promise<void> => {
  try {
    logger.info("GET /devices");
    const devices: IDevice[] = await Device.find();
    res.status(200).json({ success: true, devices });
  } catch (error) {
    logger.error(`An error occured trying to get all the devices: ${error}`);
    throw error;
  }
};

/** Gets a device by its ID */
export const getDevice = async (req: Request, res: Response): Promise<void> => {
  try {
    logger.info("GET /device/:id");
    const device: IDevice | null = await Device.findById(req.params.id);
    res.status(device ? 200 : 404).json({ success: true, device });
  } catch (error) {
    logger.error(`An error occured trying to get the device with ID ${req.params.id}: ${error}`);
    throw error;
  }
};

/** Creates a new device */
export const addDevice = async (req: Request, res: Response): Promise<void> => {
  try {
    logger.info("POST /device");

    // Get the body of the request
    const body = req.body as Pick<IDevice, "name" | "manufacturer" | "quantity" | "status" | "documentation" | "configuration" | "images">;
    let device: IDevice = new Device({
      name: body.name,
      manufacturer: body.manufacturer,
      quantity: body.quantity,
      status: body.status,
      documentation: body.documentation,
      configuration: body.configuration,
      images: body.images,
    });

    // Save the device
    const newDevice: IDevice = await device.save();
    res.status(201).json({ success: true, newDevice });
  } catch (error) {
    logger.error(`An error occured trying to create a new device: ${error}`);
    throw error;
  }
};

/** Updates a device by its ID */
export const updateDevice = async (req: Request, res: Response): Promise<void> => {
  try {
    logger.info("PUT /device/:id");
    const device: IDevice | null = await Device.findByIdAndUpdate({ _id: req.params.id }, req.body);
    res.status(device ? 200 : 404).json({ success: true, device });
  } catch (error) {
    logger.error(`An error occured trying to update the device with ID ${req.params.id}: ${error}`);
    throw error;
  }
};

/** Deletes a device by its ID */
export const deleteDevice = async (req: Request, res: Response): Promise<void> => {
  try {
    logger.info("DELETE /device/:id");
    const device: IDevice | null = await Device.findByIdAndRemove(req.params.id);
    res.status(device ? 200 : 404).json({ success: true, device });
  } catch (error) {
    logger.error(`An error occured trying to delete the device with ID ${req.params.id}: ${error}`);
    throw error;
  }
};
