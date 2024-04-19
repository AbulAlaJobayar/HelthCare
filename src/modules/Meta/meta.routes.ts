import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { MetaController } from "./meta.controller";

const route=Router()
route.post("/",auth(UserRole.SUPPER_ADMIN,UserRole.ADMIN,UserRole.DOCTOR,UserRole.PATIENT),MetaController.fetchDashboardMetaData)
export const MetaRoutes=route