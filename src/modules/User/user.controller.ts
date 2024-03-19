import { Request, Response } from "express";
import { userService } from "./user.services";

const createAdmin = async (req: Request, res: Response) => {
  try {
    const result = await userService.createAdmin(req.body);
    res.status(200).json({
      status: true,
      message: "Admin Created Successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message:"something went wrong",
      error:error
    });
  }
};
export const userController = {
  createAdmin,
};
