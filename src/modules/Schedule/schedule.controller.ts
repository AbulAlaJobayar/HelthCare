import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { ScheduleService } from "./schedule.service";
import sendResponse from "../../shared/sendResponse";
import httpStatus from "http-status";
import pick from "../../shared/pick";

const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const result = await ScheduleService.insertIntoDB(req.body);
  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: "schedule created Successfully",
    data: result,
  });
});
const getAllFromDB=catchAsync(async(req:Request & {user?:any},res:Response)=>{
  const filter = pick(req.query, [ "startDate", "endDate"]);
  const option = pick(req.query, ["page", "limit", "sortOrder", "sortBy"]);
  const user=req.user
  const result = await ScheduleService.getAllFromDB(filter, option,user);

  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: "Schedule Retrieve Successfully",
    meta: result.meta,
    data: result.data,
  });
})
export const ScheduleController = {
  insertIntoDB,
  getAllFromDB
};
