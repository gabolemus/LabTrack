import { Router } from "express";
import { getInquiries, getInquiry, addInquiry, updateInquiry, deleteInquiry } from "../controllers/inquiries";

const inquiriesRouter = Router();

inquiriesRouter.get("/inquiries", getInquiries);
inquiriesRouter.get("/inquiry/:id", getInquiry);
inquiriesRouter.post("/inquiry", addInquiry);
inquiriesRouter.put("/inquiry/:id", updateInquiry);
inquiriesRouter.delete("/inquiry/:id", deleteInquiry);

export default inquiriesRouter;
