import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import httpStatus from "http-status";
import { ReviewService } from "./review.service";

const insertIntoDB = catchAsync(
  async (req: Request & { user?: any }, res: Response) => {
    const result = await ReviewService.insertIntoDB(req.user, req.body);
    sendResponse(res, {
      status: httpStatus.OK,
      success: true,
      message: "schedule created Successfully",
      data: result,
    });

  }
);
export const ReviewController={
        insertIntoDB     
}
