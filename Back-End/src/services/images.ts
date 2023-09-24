import express, { Request, Response } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import logger from "../utils/logger";
import env from "../utils/env";

const router = express.Router();
const MAX_IMAGES = 25;

// TODO: refactor the code to separate the controllers from the routes
// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    logger.info(`Params: ${JSON.stringify(req.query)}`);
    const imgType = req.query.imgType;

    // Check if the uploads directory exists, if not create it
    const uploadsPath = path.join(`${__dirname}/../../uploads`);
    if (!fs.existsSync(uploadsPath)) {
      fs.mkdirSync(uploadsPath);
      logger.info(`Created uploads folder: ${uploadsPath}`);
    }

    // Check that the "devices" and "projects" folders exist inside the uploads directory
    const devicesPath = path.join(uploadsPath, "devices");
    if (!fs.existsSync(devicesPath)) {
      fs.mkdirSync(devicesPath);
      logger.info(`Created devices folder: ${devicesPath}`);
    }
    const projectsPath = path.join(uploadsPath, "projects");
    if (!fs.existsSync(projectsPath)) {
      fs.mkdirSync(projectsPath);
      logger.info(`Created projects folder: ${projectsPath}`);
    }

    if (imgType === "device") {
      const { manufacturer, device } = req.body; // Get manufacturer and device from request body

      // Create the manufacturer folder if it doesn't exist
      // TODO: validate that the manufacturer exists in the database
      const manufacturerPath = path.join(devicesPath, manufacturer);
      if (!fs.existsSync(manufacturerPath)) {
        fs.mkdirSync(manufacturerPath);
        logger.info(`Created manufacturer folder: ${manufacturerPath}`);
      }

      // Create the device folder inside the manufacturer folder if it doesn't exist
      // TODO: validate that the device exists in the database
      const devicePath = path.join(manufacturerPath, device);
      if (!fs.existsSync(devicePath)) {
        fs.mkdirSync(devicePath);
        logger.info(`Created device folder: ${devicePath}`);
      }

      cb(null, devicePath); // Use the device folder as the destination
    } else if (imgType === "project") {
      const { project } = req.body; // Get project from request body

      // Create the project folder if it doesn't exist
      // TODO: validate that the project exists in the database
      const projectPath = path.join(projectsPath, project);
      if (!fs.existsSync(projectPath)) {
        fs.mkdirSync(projectPath);
        logger.info(`Created project folder: ${projectPath}`);
      }

      cb(null, projectPath); // Use the project folder as the destination
    }
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

  // Check the type of image (device or project)
  const imgType = req.query.imgType;
  if (!imgType) {
    return res.status(400).json({ error: "Image type not specified" });
  }
  if (imgType !== "device" && imgType !== "project") {
    return res.status(400).json({ error: "Invalid image type" });
  }

  // Return the paths of the uploaded images
  if (imgType === "device") {
    const { manufacturer, device } = req.body;
    const uploadedImagePaths = (req.files as Express.Multer.File[]).map((file) => {
      const filename = file.filename;
      return encodeURI(`${env.images.host}:${env.port}/images/devices/${manufacturer}/${device}/${filename}`);
    });
    logger.info(`Uploaded images: ${uploadedImagePaths.join(", ")}`);
    return res.status(201).json({ imagePaths: uploadedImagePaths });
  } else if (imgType === "project") {
    const { project } = req.body;
    const uploadedImagePaths = (req.files as Express.Multer.File[]).map((file) => {
      const filename = file.filename;
      return encodeURI(`${env.images.host}:${env.port}/images/projects/${project}/${filename}`);
    });
    logger.info(`Uploaded images: ${uploadedImagePaths.join(", ")}`);
    return res.status(201).json({ imagePaths: uploadedImagePaths });
  }
});

// Define an endpoint for serving the device images
router.get("/images/devices/:manufacturer/:device/:filename", (req: Request, res: Response) => {
  logger.info(`GET /images/devices/${req.params.manufacturer}/${req.params.device}/${req.params.filename}`);
  const { manufacturer, device, filename } = req.params;
  const imagePath = path.join(`${__dirname}/../../uploads/devices/${manufacturer}/${device}/${filename}`);
  logger.info(`Image path: ${imagePath}`);

  // Check if the image file exists
  if (fs.existsSync(imagePath)) {
    res.sendFile(imagePath);
  } else {
    res.status(404).json({ error: "Image not found" });
  }
});

// Define an endpoint for serving the project images
router.get("/images/projects/:project/:filename", (req: Request, res: Response) => {
  logger.info(`GET /images/projects/${req.params.project}/${req.params.filename}`);
  const { project, filename } = req.params;
  const imagePath = path.join(`${__dirname}/../../uploads/projects/${project}/${filename}`);
  logger.info(`Image path: ${imagePath}`);

  // Check if the image file exists
  if (fs.existsSync(imagePath)) {
    res.sendFile(imagePath);
  } else {
    res.status(404).json({ error: "Image not found" });
  }
});

export default router;
