import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { AppointmentController } from "./appointment.controller";


const route=Router()
route.get('/',auth(UserRole.PATIENT,UserRole.DOCTOR),AppointmentController.getMyAppointment)
route.post('/',auth(UserRole.PATIENT),AppointmentController.insertIntoDB)

export const AppointmentRoute=route