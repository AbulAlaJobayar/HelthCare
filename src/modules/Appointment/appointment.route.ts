import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { AppointmentController } from "./appointment.controller";


const route=Router()
route.get('/',auth(UserRole.PATIENT,UserRole.DOCTOR),AppointmentController.getMyAppointment)
route.post('/',auth(UserRole.PATIENT),AppointmentController.insertIntoDB)
route.patch("/status/:id",auth(UserRole.SUPPER_ADMIN,UserRole.ADMIN,UserRole.DOCTOR),AppointmentController.changeAppointmentStatus)

export const AppointmentRoute=route