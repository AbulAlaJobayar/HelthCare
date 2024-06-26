import { Router } from "express";
import { AuthController } from "./auth.controller";
import { auth } from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const route=Router()
route.post('/login',AuthController.loginUser);
route.post('/refreshToken',AuthController.refreshToken)
route.post('/passwordChanged', auth(UserRole.SUPPER_ADMIN,UserRole.ADMIN,UserRole.DOCTOR,UserRole.PATIENT),AuthController.changedPassword)
route.post('/forgot_password',AuthController.forgotPassword)
route.post('/reset_password',AuthController.resetPassword)
export const AuthRouter=route