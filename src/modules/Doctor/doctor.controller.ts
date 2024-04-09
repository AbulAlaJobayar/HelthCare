import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";

import sendResponse from "../../shared/sendResponse";
import httpStatus from "http-status";
import pick from "../../shared/pick";
import { DoctorService } from "./doctor.service";

const getAllDoctorFromDb = catchAsync(async (req: Request, res: Response) => {
  const query = pick(req.query, [
    "name",
    "email",
    "contactNumber",
    "currentWorkingPlace",
    "qualification",
    "searchTerm",
    "specialties",
  ]);
  console.log(query);
  const filter = pick(req.query, ["page", "limit", "sortOrder", "sortBy"]);
  const result = await DoctorService.getAllDoctorFromDb(query, filter);
  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: "Doctor Retrieve Successfully",
    meta: result.meta,
    data: result.data,
  });
});
const getByIdFromDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await DoctorService.getByIdFromDB(id);
  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: "doctor retrieve Successfully",
    data: result,
  });
});
const updateIntoDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await DoctorService.updateIntoDB(id, req.body);
  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: "doctor update Successfully",
    data: result,
  });
});

const deleteByIdFromDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await DoctorService.deleteByIdFromDB(id);
  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: "doctor delete Successfully",
    data: result,
  });
});
const softDelete = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await DoctorService.softDelete(id);
  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: "doctor delete Successfully",
    data: result,
  });
});

export const DoctorController = {
  getAllDoctorFromDb,
  getByIdFromDB,
  updateIntoDB,
  deleteByIdFromDB,
  softDelete,
};
