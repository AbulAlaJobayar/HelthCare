import { Request, Response, NextFunction, Router } from "express";
import { auth } from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { fileUploader } from "../../helper/fileUploader";
import { userSchemaValidation } from "./userValidationSchema";
import { userController } from "./user.controller";

const router = Router();
router.get(
  "/",
  auth(UserRole.SUPPER_ADMIN, UserRole.ADMIN),
  userController.getAllFromDB
);
router.get(
  "/me",
  auth(
    UserRole.SUPPER_ADMIN,
    UserRole.ADMIN,
    UserRole.DOCTOR,
    UserRole.PATIENT
  ),
  userController.getMyProfile
);

router.post(
  "/",
  auth(UserRole.ADMIN, UserRole.SUPPER_ADMIN),
  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    const validateSchema = userSchemaValidation.userSchema.parse(
      JSON.parse(req.body.data)
    );
    req.body = validateSchema;
    return userController.createAdmin(req, res, next);
  }
);
router.patch(
  "/update-my-profile",
  auth(
    UserRole.ADMIN,
    UserRole.SUPPER_ADMIN,
    UserRole.DOCTOR,
    UserRole.PATIENT
  ),
  fileUploader.upload.single("file"),
  (req : Request, res: Response, next: NextFunction) => {
    
    req.body = JSON.parse(req.body.data);
    return userController.createAdmin(req, res, next);
  }
);

router.post(
  "/create-doctor",
  auth(UserRole.SUPPER_ADMIN, UserRole.ADMIN),
  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = userSchemaValidation.createDoctor.parse(
      JSON.parse(req.body.data)
    );
    return userController.updateMyProfile(req, res, next);
  }
);
export const userRoutes = router;
