import { NextFunction, Request, RequestHandler, Response } from "express";
import { adminService } from "./admin.service";
import pick from "../../shared/pick";
import { adminFilterableField } from "./admin.constant";
import sendResponse from "../../shared/sendResponse";
import httpStatus from "http-status";
import { catchAsync } from "../../shared/catchAsync";

// const catchAsync = (fn: RequestHandler) => {
//   return async (req:Request, res:Response, next:NextFunction) => {
//     try {
//     await  fn(req,res,next)
//     } catch (err) {
//       next(err);
//     }
//   };
// };

// const catchAsync=(fn:RequestHandler)=>{
//   return async(req:Request,res:Response,next:NextFunction)=>{
//     try {
//      await fn(req,res,next)
//     } catch (error) {
//     next(error)
//     }
//   }
// }

// const catchAsync=(fn:RequestHandler)=>{
//   return(req:Request,res:Response,next:NextFunction)=>{
//     Promise.resolve(fn(req,res,next)).catch((error)=>next(error))
//   }
// }

// const catchAsync = (fn: RequestHandler) => {
//   return async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       await fn(req, res, next);
//     } catch (err) {
//       next(err);
//     }
//   };
// };

// const catchAsync=(fn:RequestHandler)=>{
//   return(req:Request,res:Response,next:NextFunction)=>{
//     Promise.resolve(fn(req,res,next)).catch(err=>next(err))
//   }
// }

const getAllFromDB = catchAsync(async(req,res)=>{

      const filter = pick(req.query, adminFilterableField);
      const option = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
      const result = await adminService.getAllFromDB(filter, option);
      sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: "Admin retrieve successfully",
        meta: result.meta,
        data: result.data,
      });
    }) 
 

const getByIdFromDB = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    console.log(id);
    const result = await adminService.getByIdFromDB(id);
    sendResponse(res, {
      status: httpStatus.OK,
      success: true,
      message: "Admin retrieve successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error || "something went Wrong",
      error,
    });
  }
};
const updateIntoDB = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const result = await adminService.updateIntoDB(id, req.body);
    sendResponse(res, {
      status: httpStatus.OK,
      success: true,
      message: "Admin update successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const deleteIntoDB = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await adminService.deleteIntoDB(id);
    sendResponse(res, {
      status: httpStatus.OK,
      success: true,
      message: "Admin delete successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error || "something went Wrong",
      error,
    });
  }
};

const adminSoftDeleteIntoDB = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await adminService.adminSoftDeleteIntoDB(id);
    sendResponse(res, {
      status: httpStatus.OK,
      success: true,
      message: "Admin delete successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error || "something went Wrong",
      error,
    });
  }
};

export const adminController = {
  getAllFromDB,
  getByIdFromDB,
  updateIntoDB,
  deleteIntoDB,
  adminSoftDeleteIntoDB,
};
