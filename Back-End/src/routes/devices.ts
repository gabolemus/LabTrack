import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("Devices home page");
});

router.get("/:id", (req, res) => {
  res.send(`Device with id ${req.params.id}`);
});

export default router;
