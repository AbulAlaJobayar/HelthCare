import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { ScheduleService } from "./schedule.service";
import sendResponse from "../../shared/sendResponse";
import httpStatus from "http-status";

const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const result = await ScheduleService.insertIntoDB(req.body);
  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: "schedule created Successfully",
    data: result,
  });
});

export const ScheduleController = {
  insertIntoDB,
};
