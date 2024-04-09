import { Router } from "express";
import { PatientController } from "./patient.controller";

const route= Router()
route.get("/",PatientController.getAllFromDB)
route.get("/:id",PatientController.getByIdFromDB)
route.patch("/:id",PatientController.updateIntoDB)
route.delete("/soft/:id",PatientController.softDeleteByIdFromDB)
route.delete("/:id",PatientController.deleteByIdFromDB)

export const PatientRoute=route