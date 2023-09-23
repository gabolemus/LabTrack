import express from "express";

// App utilities imports
import logger from "./utils/logger";
import env from "./utils/env";

// Router imports
import indexRouter from "./routes/index";
import devicesRouter from "./routes/devices";

// Services imports
import mailRouter from "./services/mailer";

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
