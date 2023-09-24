import { Response, Request } from "express";
import { Document, Model } from "mongoose";
import logger from "../utils/logger";

export class BaseController<T extends Document> {
  protected model: Model<T>;
  protected modelName: string;
  protected uniqueFieldName: string;
  protected enforceUniqueField: boolean;

  constructor(model: Model<T>, modelName: string, uniqueFieldName: string = "", enforceUniqueField: boolean = false) {
    this.model = model;
    this.modelName = modelName;
    this.uniqueFieldName = uniqueFieldName;
    this.enforceUniqueField = enforceUniqueField;
  }

  public getItems = async (req: Request, res: Response): Promise<void> => {
    try {
      logger.info(`GET /${this.modelName}s`);
      const items = await this.model.find();
      res.status(200).json({ success: true, length: items.length, [`${this.modelName}s`]: items });
    } catch (error) {
      this.handleError(res, error);
    }
  };

  public getItem = async (req: Request, res: Response): Promise<void> => {
    try {
      logger.info(`GET /${this.modelName}?id=${req.query.id}`);
      const item = await this.model.findById(req.query.id);
      res.status(item ? 200 : 404).json({ success: true, [this.modelName]: item });
    } catch (error) {
      this.handleError(res, error);
    }
  };

  public createItem = async (req: Request, res: Response): Promise<void> => {
    try {
      logger.info(`POST /${this.modelName} ${JSON.stringify(req.body)}`);

      if (this.enforceUniqueField && this.uniqueFieldName !== "") {
        // Check if an item with the same uniqueField value already exists
        const filterQuery: Partial<Record<string, any>> = {};
        filterQuery[this.uniqueFieldName] = req.body[this.uniqueFieldName];
        const existingItem = await this.model.findOne(filterQuery);

        if (existingItem) {
          res.status(400).json({
            success: false,
            error: 'ENFORCE_UNIQUE_FIELD',
            message: `An entry in the ${this.modelName}s collection already exists with the value '${
              req.body[this.uniqueFieldName]
            }' for the field '${this.uniqueFieldName}'`,
          });
          return;
        }
      }

      const newItem = new this.model(req.body);
      const savedItem = await newItem.save();
      res.status(201).json({ success: true, [`new${this.modelName}`]: savedItem });
    } catch (error) {
      this.handleError(res, error);
    }
  };

  public updateItem = async (req: Request, res: Response): Promise<void> => {
    try {
      logger.info(`PUT /${this.modelName}?id=${req.query.id} ${JSON.stringify(req.body)}`);
      const updatedItem = await this.model.findByIdAndUpdate(req.query.id, req.body);
      res.status(updatedItem ? 200 : 404).json({ success: true, [this.modelName]: updatedItem });
    } catch (error) {
      this.handleError(res, error);
    }
  };

  public deleteItem = async (req: Request, res: Response): Promise<void> => {
    try {
      logger.info(`DELETE /${this.modelName}?id=${req.query.id}`);
      const deletedItem = await this.model.findByIdAndDelete(req.query.id);
      res.status(deletedItem ? 200 : 404).json({ success: true, [this.modelName]: deletedItem });
    } catch (error) {
      this.handleError(res, error);
    }
  };

  protected handleError(res: Response, error: any): void {
    logger.error(`An error occurred: ${error}`);
    res.status(500).json({ success: false, error });
  }
}
