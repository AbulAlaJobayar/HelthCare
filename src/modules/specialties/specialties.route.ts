import { NextFunction, Request, Response, Router } from "express";
import { SpecialtiesController } from "./specialties.controller";
import { auth } from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { fileUploader } from "../../helper/fileUploader";
import { SpecialtiesSchema } from "./spacialties.validation";

const route = Router();
route.post(
  "/",

  auth(
    UserRole.SUPPER_ADMIN,
    UserRole.ADMIN,
    UserRole.DOCTOR,
    UserRole.PATIENT
  ),
  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = SpecialtiesSchema.specialtiesSchemaValidation.parse(
      JSON.parse(req.body.data)
    );
    return SpecialtiesController.insertIntoDB(req, res, next);
  }
);
route.get('/',SpecialtiesController.getAllSpecialties);
route.delete('/:id',SpecialtiesController.deleteSpecialties)
export const SpecialtiesRoute = route;
