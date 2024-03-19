import { Request, Response } from "express";
import { adminService } from "./admin.service";
import pick from "../../shared/pick";
import { adminFilterableField } from "./admin.constant";

const getAllFromDB = async (req: Request, res: Response) => {
  try {
    const filter = pick(req.query, adminFilterableField);
    const option = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
    const result = await adminService.getAllFromDB(filter, option);
    res.status(200).json({
      status: true,
      message: "Admin retrieve successfully",
      meta:result.meta,
      data: result.data,
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
};
