import { Router } from "express";
import { ScheduleController } from "./schedule.controller";

const route=Router()
route.post('/',ScheduleController.insertIntoDB)
export const ScheduleRoute=route