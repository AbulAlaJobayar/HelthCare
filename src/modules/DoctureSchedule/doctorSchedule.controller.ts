import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { DoctorScheduleService } from "./doctorSchedule.service";
import sendResponse from "../../shared/sendResponse";
import httpStatus from "http-status";
import pick from "../../shared/pick";

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
const getMySchedule=catchAsync(async(req:Request & {user?:any},res:Response)=>{
  const filter = pick(req.query, [ "startDate", "endDate","isBooked"]);
  const option = pick(req.query, ["page", "limit", "sortOrder", "sortBy"]);
  const user=req.user
  const result = await DoctorScheduleService.getMySchedule(filter, option,user);

  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: "Doctor Schedule Retrieve Successfully",
    meta: result.meta,
    data: result.data,
  });
})
const deleteIntoDB = catchAsync(
  async (req: Request & { user?: any }, res: Response) => {
    const user = req.user;
    const {id}=req.params
    const result = await DoctorScheduleService.deleteIntoDB(user,id);
    sendResponse(res, {
      status: httpStatus.OK,
      success: true,
      message: "doctorSchedule Delete Successfully",
      data: result,
    });
  }
);
export const DoctorScheduleController = {
  insertIntoDB,
  getMySchedule,
  deleteIntoDB
};
