import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { DoctorScheduleService } from "./doctorSchedule.controller";
import sendResponse from "../../shared/sendResponse";
import httpStatus from "http-status";

const insertIntoDB = catchAsync(
  async (req: Request & { user?: any }, res: Response) => {
    const user = req.user;
    const result = await DoctorScheduleService.insertIntoDB(user,req.body);
    sendResponse(res, {
      status: httpStatus.OK,
      success: true,
      message: "doctorSchedule created Successfully",
      data: result,
    });
  }
);

export const DoctorScheduleController = {
  insertIntoDB,
};
