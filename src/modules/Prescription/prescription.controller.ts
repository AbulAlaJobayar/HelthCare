import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { PrescriptionService } from "./prescription.service";
import sendResponse from "../../shared/sendResponse";
import httpStatus from "http-status";
import { JwtPayload } from "jsonwebtoken";
import pick from "../../shared/pick";

const insertIntoDB = catchAsync(async (req: Request &{user?:any}, res: Response) => {
  const user=req.user
  const result = await PrescriptionService.insertIntoDB(user,req.body);
  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: "prescription created Successfully",
    data: result,
  });
});
const patientPrescription= catchAsync(async (req: Request &{user?:any}, res: Response) => {
  const filter = pick(req.query, ["page", "limit", "sortOrder", "sortBy"]);
  const user=req.user
  const result = await PrescriptionService.patientPrescription(user,filter);
  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: "prescription retrieve Successfully",
    meta:result.meta,
    data: result.data,
  });
});


export const PrescriptionController={
        insertIntoDB ,
        patientPrescription    
}
