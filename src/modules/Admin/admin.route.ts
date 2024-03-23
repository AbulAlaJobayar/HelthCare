import { NextFunction, Request, Response, Router } from "express";
import { adminController } from "./admin.controller";
import { AnyZodObject, string, z } from "zod";
import { validateRequest } from "../../middlewares/validateRequest";
import { adminValidationSchema } from "./admin.validation";
import { auth } from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

// const validateRequest = (schema: AnyZodObject) => {
//   return async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       await schema.parseAsync(req.body);
//       next();
//     } catch (error) {
//       next(error);
//     }
//   };
// };

const router = Router();
router.get(
  "/",
  auth(UserRole.SUPPER_ADMIN, UserRole.ADMIN),
  adminController.getAllFromDB
);
router.get(
  "/:id",
  auth(UserRole.SUPPER_ADMIN, UserRole.ADMIN),
  adminController.getByIdFromDB
);
router.patch(
  "/:id",
  auth(UserRole.SUPPER_ADMIN, UserRole.ADMIN),
  validateRequest(adminValidationSchema.updateAdminSchema),
  adminController.updateIntoDB
);
router.delete(
  "/:id",
  auth(UserRole.SUPPER_ADMIN, UserRole.ADMIN),
  adminController.deleteIntoDB
);
router.delete(
  "/soft/:id",
  auth(UserRole.SUPPER_ADMIN, UserRole.ADMIN),
  adminController.adminSoftDeleteIntoDB
);

export const adminRoute = router;
