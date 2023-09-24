import { BaseController } from "./BaseController";
import Inquiry from "../models/inquiries";
import { IInquiry } from "../types/inquiry";

export class InquiriesController extends BaseController<IInquiry> {
  constructor() {
    super(Inquiry, "inquiry");
  }
}

export const inquiriesController = new InquiriesController();
