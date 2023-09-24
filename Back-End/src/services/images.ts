import express, { Request, Response } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import logger from "../utils/logger";

const router = express.Router();
const MAX_IMAGES = 25;

// TODO: refactor the code to separate the controllers from the routes
// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const { manufacturer, device } = req.body; // Get manufacturer and device from request body

    // Check if the uploads directory exists, if not create it
    const uploadsPath = path.join(`${__dirname}/../../uploads`);
    if (!fs.existsSync(uploadsPath)) {
      fs.mkdirSync(uploadsPath);
      logger.info(`Created uploads folder: ${uploadsPath}`);
    }

    // Create the manufacturer folder if it doesn't exist
    const manufacturerPath = path.join(uploadsPath, manufacturer);
    if (!fs.existsSync(manufacturerPath)) {
      fs.mkdirSync(manufacturerPath);
      logger.info(`Created manufacturer folder: ${manufacturerPath}`);
    }

    // Create the device folder inside the manufacturer folder if it doesn't exist
    const devicePath = path.join(manufacturerPath, device);
    if (!fs.existsSync(devicePath)) {
      fs.mkdirSync(devicePath);
      logger.info(`Created device folder: ${devicePath}`);
    }

    cb(null, devicePath); // Use the device folder as the destination
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const fileName = file.originalname.split(".")[0].toLowerCase();
    cb(null, `${fileName}-${Date.now()}${ext}`);
  },
});

// Create the multer instance
const upload = multer({ storage });

// Define an endpoint for uploading images
router.post("/images/upload", upload.array("images", MAX_IMAGES), (req: Request, res: Response) => {
  // TODO: add validation for the manufacturer and device
  // TODO: return an error message when the maximum amount of images is exceeded
  logger.info(`Length: ${req.files?.length}`);

  // Check if the request contains any files
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: "No images provided" });
  }
  const uploadedImagePaths = (req.files as Express.Multer.File[]).map((file) => file.path);
  logger.info(`Uploaded images: ${uploadedImagePaths.join(", ")}`);
  // Respond with an array of paths to the uploaded images
  res.status(201).json({ imagePaths: uploadedImagePaths });
});

// Define an endpoint for serving images by their filename
router.get("/images/:manufacturer/:device/:filename", (req: Request, res: Response) => {
  logger.info(`GET /images/${req.params.manufacturer}/${req.params.device}/${req.params.filename}`);
  const { manufacturer, device, filename } = req.params;
  const imagePath = path.join(`${__dirname}/../../uploads`, manufacturer, device, filename);

  // Check if the image file exists
  if (fs.existsSync(imagePath)) {
    res.sendFile(imagePath);
  } else {
    res.status(404).json({ error: "Image not found" });
  }
});

export default router;
