import { NextFunction, Request, Response, Router } from "express";
import { adminController } from "./admin.controller";
import { AnyZodObject, string, z } from "zod";
import { validateRequest } from "../../middlewares/validateRequest";
import { adminValidationSchema } from "./admin.validation";


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
router.get("/", adminController.getAllFromDB);
router.get("/:id", adminController.getByIdFromDB);
router.patch("/:id", validateRequest(adminValidationSchema.updateAdminSchema), adminController.updateIntoDB);
router.delete("/:id", adminController.deleteIntoDB);
router.delete("/soft/:id", adminController.adminSoftDeleteIntoDB);

export const adminRoute = router;
