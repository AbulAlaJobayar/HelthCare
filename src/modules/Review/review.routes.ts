import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { ReviewController } from "./review.controller";

const route =Router()
route.post('/',auth(UserRole.PATIENT),ReviewController.insertIntoDB)



export const ReviewRoute=route