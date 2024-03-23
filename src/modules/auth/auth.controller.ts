import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { AuthService } from "./auth.service";
import sendResponse from "../../shared/sendResponse";
import httpStatus from "http-status";

const loginUser = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.loginUser(req.body);
  const {refreshToken,...rest}=result
  res.cookie('refreshToken',refreshToken,{
    secure:false,
    httpOnly:true
  })

  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: "Logged successfully",
    data: rest,
  });
});
const refreshToken=catchAsync(async(req,res)=>{
  const {refreshToken}=req.cookies ;
  const result = await AuthService.refreshToken(refreshToken)
  sendResponse(res,{
    status:httpStatus.OK,
    success:true,
    message:"RefreshToken Retrieve Successfully !!!",
    data:result
    })
})
const changedPassword=catchAsync(async(req,res)=>{
  
  const result = await AuthService.changedPassword(req.user,req.body)
  sendResponse(res,{
    status:httpStatus.OK,
    success:true,
    message:"password Changed successfully !!!",
    data:result
    })
})

export const AuthController = {
  loginUser,
  refreshToken,
  changedPassword
};
