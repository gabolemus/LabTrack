import express from "express";
import indexRouter from "./routes/index";
import devicesRouter from "./routes/devices";

const app = express();
const port = 3000;

app.use("/", indexRouter);
app.use("/devices", devicesRouter);

app.listen(port, () => {
  console.log(`The LabTrack server is listening on http://localhost:${port}`);
});
