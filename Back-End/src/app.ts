import express from "express";

import logger from "./utils/logger";
import env from "./utils/env";

import indexRouter from "./routes/index";
import devicesRouter from "./routes/devices";
import mailRouter from "./routes/mailer";

const app = express();
const port = env.port;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", indexRouter);
app.use("/devices", devicesRouter);
app.use("/mailer", mailRouter);

app.listen(port, () => {
  logger.info(`The LabTrack server is listening on http://localhost:${port}`);
});
