import { Request, Response } from "express";
import { BaseController } from "./BaseController";
import Tag from "../models/tags";
import { ITag } from "../types/tag";
import logger from "../utils/logger";

export class TagsController extends BaseController<ITag> {
  constructor() {
    super(Tag, "tag", "name", true);
  }

  /** Method to update tags in bulk */
  public updateItemsInBulk = async (req: Request, res: Response): Promise<void> => {
    logger.info(`PUT /tags`);

    try {
      const { tags } = req.body;

      // Check that each tag's name is unique
      const names = tags.map((tag: ITag) => tag.name);
      const uniqueNames = [...new Set(names)];
      if (names.length !== uniqueNames.length) {
        const nonUniqueName = names.find((name: string) => names.indexOf(name) !== names.lastIndexOf(name));
        res.status(400).json({ success: false, error: "ENFORCE_UNIQUE_FIELD", message: "Each tag's name must be unique", nonUniqueName });
        return;
      }

      // Update the tags
      const updatedTags = await Promise.all(
        tags.map(async (tag: ITag) => {
          const { _id, name } = tag;
          const updatedTag = await Tag.findByIdAndUpdate(_id, { name }, { new: true });
          return updatedTag;
        }),
      );

      res.status(200).json({ success: true, length: updatedTags.length, tags: updatedTags });
    } catch (error) {
      this.handleError(res, error);
    }
  };
}

export const tagsController = new TagsController();
