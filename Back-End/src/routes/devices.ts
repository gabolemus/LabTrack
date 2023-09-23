import express from "express";

import logger from "../utils/logger";

const router = express.Router();

router.get("/", (req, res) => {
  logger.info("GET /devices");
  res.send("Devices home page");
});

router.get("/:id", (req, res) => {
  logger.info(`GET /devices/${req.params.id}`);
  res.send(`Device with id ${req.params.id}`);
});

export default router;
