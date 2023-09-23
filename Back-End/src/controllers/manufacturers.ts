import { Response, Request } from "express";
import { IManufacturer } from "../types/manufacturer";
import Manufacturer from "../models/manufacturers";
import logger from "../utils/logger";

/** Gets all the manufacturers in the database */
export const getManufacturers = async (req: Request, res: Response): Promise<void> => {
  try {
    logger.info("getManufacturers function called");
    const manufacturers: IManufacturer[] = await Manufacturer.find();
    res.status(200).json({ success: true, manufacturers });
  } catch (error) {
    logger.error(`An error occured trying to get all the manufacturers: ${error}`);
    throw error;
  }
};

/** Gets a manufacturer by its ID */
export const getManufacturer = async (req: Request, res: Response): Promise<void> => {
  try {
    logger.info("getManufacturer function called");
    const manufacturer: IManufacturer | null = await Manufacturer.findById(req.params.id);
    res.status(manufacturer ? 200 : 404).json({ success: true, manufacturer });
  } catch (error) {
    logger.error(`An error occured trying to get the manufacturer with ID ${req.params.id}: ${error}`);
    throw error;
  }
};

/** Creates a new manufacturer */
export const addManufacturer = async (req: Request, res: Response): Promise<void> => {
  try {
    logger.info("addManufacturer function called");

    // Get the body of the request
    const body = req.body as Pick<IManufacturer, "name">;
    let manufacturer: IManufacturer = new Manufacturer({
      name: body.name,
    });

    // Check if the name of the manufacturer can be used as its ID
    const manufacturerName = manufacturer.name.replace(/\s+/g, "_").toLowerCase();

    // Check if the manufacturer ID already exists
    let manufacturerID = manufacturerName;
    let manufacturerIDExists = await Manufacturer.exists({ id: manufacturerID });
    while (manufacturerIDExists) {
      manufacturerID = `${manufacturerName}_${Math.floor(Math.random() * 100)}`;
      manufacturerIDExists = await Manufacturer.exists({ id: manufacturerID });
    }
    if (manufacturerID !== manufacturerName) {
      manufacturer.id = manufacturerID;
    } else {
      manufacturer.id = `${manufacturerName}-${manufacturerID}`;
    }

    // Save the manufacturer
    const newManufacturer: IManufacturer = await manufacturer.save();
    res.status(201).json({ success: true, manufacturer: newManufacturer });
  } catch (error) {
    logger.error(`An error occured trying to create a new manufacturer: ${error}`);
    throw error;
  }
};

/** Updates a manufacturer by its ID */
export const updateManufacturer = async (req: Request, res: Response): Promise<void> => {
  try {
    logger.info("updateManufacturer function called");
    const manufacturer: IManufacturer | null = await Manufacturer.findByIdAndUpdate(
      req.params.id,
      req.body,
    );
    res.status(manufacturer ? 200 : 404).json({ success: true, manufacturer });
  } catch (error) {
    logger.error(`An error occured trying to update the manufacturer with ID ${req.params.id}: ${error}`);
    throw error;
  }
};

/** Deletes a manufacturer by its ID */
export const deleteManufacturer = async (req: Request, res: Response): Promise<void> => {
  try {
    logger.info("deleteManufacturer function called");
    const manufacturer: IManufacturer | null = await Manufacturer.findByIdAndDelete(req.params.id);
    res.status(manufacturer ? 200 : 404).json({ success: true, manufacturer });
  } catch (error) {
    logger.error(`An error occured trying to delete the manufacturer with ID ${req.params.id}: ${error}`);
    throw error;
  }
};
