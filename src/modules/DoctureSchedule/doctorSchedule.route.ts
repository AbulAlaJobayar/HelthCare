import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { DoctorScheduleController } from "./doctorSchedule.model";

const route= Router()
route.post('/',auth(UserRole.DOCTOR),DoctorScheduleController.insertIntoDB)
export const DoctorScheduleRoute=route