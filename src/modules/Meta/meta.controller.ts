import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import httpStatus from "http-status";
import { MetaService } from "./meta.service";

const fetchDashboardMetaData = catchAsync(
  async (req: Request & { user?: any }, res: Response) => {
    const result = await MetaService.fetchDashboardMetaData(req.user);
    sendResponse(res, {
      status: httpStatus.OK,
      success: true,
      message: "meta Data retrieve successfully!!!",
      data: result,
    });
  }
);
export const MetaController = {
  fetchDashboardMetaData,
};
