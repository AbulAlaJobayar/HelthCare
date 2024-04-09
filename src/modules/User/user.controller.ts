import { Request, Response } from "express";
import { userService } from "./user.services";
import { catchAsync } from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import httpStatus from "http-status";
import pick from "../../shared/pick";
import { userFilterableFields } from "./user.constant";

const createAdmin = catchAsync(async(req:Request,res:Response)=>{
  const result=await userService.createAdmin(req);
  sendResponse(res,{
    status:httpStatus.OK,
    success:true,
    message:"admin created Successfully",
    data:result
  })
})
const createDoctor = catchAsync(async (req: Request, res: Response) => {

  const result = await userService.createDoctor(req);
  sendResponse(res, {
      status: httpStatus.OK,
      success: true,
      message: "Doctor Created successfully!",
      data: result
  })
});
const createPatient = catchAsync(async (req: Request, res: Response) => {
  //const { patient, ...userData } = req.body;
  const result = await userService.createPatient(req);
  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: 'Patient created successfully!',
    data: result,
  });
});
const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
  // console.log(req.query)
  const filters = pick(req.query, userFilterableFields);
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder'])

  const result = await userService.getAllFromDB(filters, options)

  sendResponse(res, {
      status: httpStatus.OK,
      success: true,
      message: "Users data fetched!",
      meta: result.meta,
      data: result.data
  })
});

const getMyProfile = catchAsync(async(req:Request &{user?:any},res:Response)=>{
  const result=await userService.getMyProfile(req.user);
  sendResponse(res,{
    status:httpStatus.OK,
    success:true,
    message:"user retrieved Successfully",
    data:result
  })
})
const updateMyProfile = catchAsync(async(req:Request &{user?:any},res:Response)=>{
  const result=await userService.updateMyProfile(req.user,req);
  sendResponse(res,{
    status:httpStatus.OK,
    success:true,
    message:"admin created Successfully",
    data:result
  })
})

export const userController = {
  createAdmin,
  createDoctor,
  createPatient,
  getAllFromDB,
  getMyProfile,
  updateMyProfile
};
