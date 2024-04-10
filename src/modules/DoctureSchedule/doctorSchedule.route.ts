import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { DoctorScheduleController } from "./doctorSchedule.controller";

const route= Router()
route.get('/',auth(UserRole.DOCTOR),DoctorScheduleController.getMySchedule)
route.post('/',auth(UserRole.DOCTOR),DoctorScheduleController.insertIntoDB)
route.delete('/:id',auth(UserRole.DOCTOR),DoctorScheduleController.deleteIntoDB)
export const DoctorScheduleRoute=route