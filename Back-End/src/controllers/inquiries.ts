import { Response, Request } from "express";
import { IInquiry } from "../types/inquiry";
import Inquiry from "../models/inquiries";

import logger from "../utils/logger";

/** Gets all the inquiries in the database */
export const getInquiries = async (req: Request, res: Response): Promise<void> => {
  try {
    logger.info("getInquiries function called");
    const inquiries: IInquiry[] = await Inquiry.find();
    res.status(200).json({ success: true, inquiries });
  } catch (error) {
    logger.error(`An error occured trying to get all the inquiries: ${error}`);
    throw error;
  }
};

/** Gets an inquiry by its ID */
export const getInquiry = async (req: Request, res: Response): Promise<void> => {
  try {
    logger.info("getInquiry function called");
    const inquiry: IInquiry | null = await Inquiry.findById(req.params.id);
    res.status(inquiry ? 200 : 404).json({ success: true, inquiry });
  } catch (error) {
    logger.error(`An error occured trying to get the inquiry with ID ${req.params.id}: ${error}`);
    throw error;
  }
};

/** Creates a new inquiry */
export const addInquiry = async (req: Request, res: Response): Promise<void> => {
  try {
    logger.info("addInquiry function called");

    // Get the body of the request
    const body = req.body as Pick<IInquiry, "email" | "projectID" | "devicesID" | "status">;
    let inquiry: IInquiry = new Inquiry({
      email: body.email,
      projectID: body.projectID,
      devicesID: body.devicesID,
      status: body.status,
    });

    // Save the inquiry
    const newInquiry: IInquiry = await inquiry.save();
    res.status(201).json({ success: true, inquiry: newInquiry });
  } catch (error) {
    logger.error(`An error occured trying to create a new inquiry: ${error}`);
    throw error;
  }
};

/** Updates an inquiry by its ID */
export const updateInquiry = async (req: Request, res: Response): Promise<void> => {
  try {
    logger.info("updateInquiry function called");
    const inquiry: IInquiry | null = await Inquiry.findByIdAndUpdate(
      req.params.id,
      req.body,
    );
    res.status(inquiry ? 200 : 404).json({ success: true, inquiry });
  } catch (error) {
    logger.error(`An error occured trying to update the inquiry with ID ${req.params.id}: ${error}`);
    throw error;
  }
};

/** Deletes an inquiry by its ID */
export const deleteInquiry = async (req: Request, res: Response): Promise<void> => {
  try {
    logger.info("deleteInquiry function called");
    const inquiry: IInquiry | null = await Inquiry.findByIdAndDelete(req.params.id);
    res.status(inquiry ? 200 : 404).json({ success: true, inquiry });
  } catch (error) {
    logger.error(`An error occured trying to delete the inquiry with ID ${req.params.id}: ${error}`);
    throw error;
  }
};
