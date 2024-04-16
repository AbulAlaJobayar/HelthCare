import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import httpStatus from "http-status";
import { PaymentService } from "./payment.service";

const initPayment = catchAsync(async (req: Request, res: Response) => {
  const {id}=req.params
        const result = await PaymentService.initPayment(id);
  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: "Payment init successfully",
    data: result,
  });
});
const validatePayment = catchAsync(async (req: Request, res: Response) => {
  
  const result = await PaymentService.validatePayment(req.query);
  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: "Payment verified!",
    data: result,
  });
});
export const PaymentController = {
  initPayment,
  validatePayment
};
