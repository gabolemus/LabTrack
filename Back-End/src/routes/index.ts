import express from "express";

import logger from "../utils/logger";

const router = express.Router();

router.get("/", (req, res) => {
  logger.info("GET /");
  res.send("Hello, world!");
});

export default router;
