import httpStatus from "http-status";
import { catchAsync } from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { PatientService } from "./patient.service";
import pick from "../../shared/pick";

const getAllFromDB = catchAsync(async (req, res) => {
  const filter = pick(req.query, ["searchTerm", "name", "Email"]);
  const option = pick(req.query, ["page", "limit", "sortOrder", "sortBy"]);
  const result = await PatientService.getAllFromDB(filter, option);

  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: "patient Retrieve Successfully",
    meta: result.meta,
    data: result.data,
  });
});
const getByIdFromDB = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await PatientService.getByIdFromDB(id);
  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: "patient Retrieve Successfully",
    data: result,
  });
});
const updateIntoDB = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await PatientService.updateIntoDB(id,req.body)
  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: "patient Updated Successfully",
    data: result,
  });
});
const deleteByIdFromDB = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await PatientService.deleteByIdFromDB(id);
  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: "patient delete Successfully",
    data: result,
  });
});
const softDeleteByIdFromDB = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await PatientService.softDeleteByIdFromDB(id);
  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: "patient delete Successfully",
    data: result,
  });
});

export const PatientController = {
  getAllFromDB,
  getByIdFromDB,
  updateIntoDB,
  deleteByIdFromDB,
  softDeleteByIdFromDB
};
