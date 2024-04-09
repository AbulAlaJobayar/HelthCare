import httpStatus from "http-status";
import { catchAsync } from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { SpecialtiesService } from "./specialties.service";
import { Request, Response } from "express";
// { SpecialtiesSchema } from "./spacialties.validation";

const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const result = await SpecialtiesService.insertIntoDB(req);
  sendResponse(res, {
    status: httpStatus.CREATED,
    success: true,
    message: "specialties created successfully",
    data: result,
  });
});
const getAllSpecialties = catchAsync(async (req: Request, res: Response) => {
  const result = await SpecialtiesService.getAllSpecialties();
  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: "specialties Retrieve Successfully",
    data: result,
  });
});
const deleteSpecialties=catchAsync(async(req:Request,res:Response)=>{
  const {id}=req.params;
  const result=await SpecialtiesService.deleteSpecialties(id)

  sendResponse(res,{
    status:httpStatus.OK,
    success:true,
    message:"Specialties delete successfully",
    data:result
  })
})
export const SpecialtiesController = {
  insertIntoDB,
  getAllSpecialties,
  deleteSpecialties
};
