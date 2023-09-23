import express from "express";
import mongoose, { ConnectOptions } from "mongoose";
import cors from "cors";

// App utilities imports
import logger from "./utils/logger";
import env from "./utils/env";

// Router imports
import indexRouter from "./routes/index";
import devicesRouter from "./routes/devices";
import inquiriesRouter from "./routes/inquiries";
import manufacturersRouter from "./routes/manufacturers";
import projectsRouter from "./routes/projects";
import usersRouter from "./routes/users";

// Services imports
import mailRouter from "./services/mailer";

const app = express();
const PORT = env.port;

// Express configuration
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use(indexRouter);
app.use(devicesRouter);
app.use(inquiriesRouter);
app.use(manufacturersRouter);
app.use(projectsRouter);
app.use(usersRouter);

// Services
app.use(mailRouter);

// Default MongoDB host when running locally
let MONGO_HOST = "localhost";

// Check if the environment is set to Docker or local
if (process.env.DOCKER === "true") {
  // Set the MongoDB host to the Docker container name
  MONGO_HOST = "mongodb";
}

// MongoDB connection
const encodedPassword = encodeURIComponent(env.db.password); // Encode the password to handle special characters
const MONGO_URI = `mongodb://${env.db.username}:${encodedPassword}@${MONGO_HOST}:${env.db.port}/`;

// Attempt to connect to MongoDB
const connectWithRetry = (retries: number) => {
  retries--;

  if (retries === 0) {
    logger.error("Could not connect to MongoDB");
    process.exit(-1);
  }

  mongoose
    .connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as ConnectOptions)
    .then(() => logger.info("Successfully connected to MongoDB"))
    .catch((err) => {
      logger.error(`An error occurred while connecting to MongoDB: ${err}`)
      logger.info("Retrying connection to MongoDB...");
      setTimeout(connectWithRetry, 1000);
    });
};

const retries = 5;
connectWithRetry(retries);

// Start server
const server = app.listen(PORT, () => {
  logger.info(`The LabTrack server is listening on http://localhost:${PORT}`);
});

// Gracefully handle shutdown
process.on("SIGINT", () => {
  logger.info("Shutting down the server...");

  // Close the server and MongoDB connection gracefully
  server.close(() => {
    mongoose.connection.close(false);
    logger.info("Successfully shut down the server and MongoDB connection");
  });
});
