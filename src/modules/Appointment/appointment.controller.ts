import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { AppointmentService } from "./appointment.service";
import sendResponse from "../../shared/sendResponse";
import httpStatus from "http-status";
import pick from "../../shared/pick";

const insertIntoDB = catchAsync(
  async (req: Request & { user?: any }, res: Response) => {
    const user = req.user;
    const result = await AppointmentService.insertIntoDB(user, req.body);
    sendResponse(res, {
      status: httpStatus.OK,
      success: true,
      message: "appointment created Successfully",
      data: result,
    });
  }
);
const getMyAppointment = catchAsync(async(req:Request & {user?:any},res:Response)=>{
const user=req.user
  const filter = pick(req.query, ["status","paymentStatus"]);
  const option = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
  const result = await AppointmentService.getMyAppointment(user,filter, option);
  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: "Appointment retrieve successfully",
    meta: result.meta,
    data: result.data,
  });
}) 
const changeAppointmentStatus = catchAsync(async(req:Request & {user?:any},res:Response)=>{
const {id}=req.params
  const {status}=req.body
  const user=req.user
  const result = await AppointmentService.changeAppointmentStatus(id,status,user);
  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: "Appointment change successfully",
    data: result,
  });
}) 
export const AppointmentController = {
  insertIntoDB,
  getMyAppointment,
  changeAppointmentStatus
};
