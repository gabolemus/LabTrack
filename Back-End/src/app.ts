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

// MongoDB connection
const MONGO_URI = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cluster0.raz9g.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`;

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as ConnectOptions)
  .then(() => logger.info("Successfully connected to MongoDB"))
  .catch((err) => logger.error(`An error occurred while connecting to MongoDB: ${err}`));

// Start server
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
