import { Router } from "express";
import { ScheduleController } from "./schedule.controller";
import { auth } from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const route=Router()
route.get('/',auth(UserRole.DOCTOR),ScheduleController.getAllFromDB)
route.post('/',ScheduleController.insertIntoDB)
export const ScheduleRoute=route