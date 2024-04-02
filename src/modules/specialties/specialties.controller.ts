import httpStatus from "http-status";
import { catchAsync } from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { SpecialtiesService } from "./specialties.service";

const insertIntoDB = catchAsync(async (req, res) => {
  const result = await SpecialtiesService.insertIntoDB(req)
  sendResponse(res, {
    status: httpStatus.CREATED,
    success: true,
    message: "specialties created successfully",
    data: result,
  });
});


export const SpecialtiesController = {
        insertIntoDB,
};
