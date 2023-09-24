import { BaseController } from "./BaseController";
import Device from "../models/devices";
import { IDevice } from "../types/device";

export class DevicesController extends BaseController<IDevice> {
  constructor() {
    super(Device, "device");
  }
}

export const devicesController = new DevicesController();
