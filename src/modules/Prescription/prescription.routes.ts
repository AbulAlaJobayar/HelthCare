import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { PrescriptionController } from "./prescription.controller";

const route= Router()
route.get('/my_prescription',auth(UserRole.PATIENT),PrescriptionController.patientPrescription)
route.post('/',auth(UserRole.DOCTOR),PrescriptionController.insertIntoDB)


export const PrescriptionRoute=route