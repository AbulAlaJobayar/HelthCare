import { Request, Response, Router } from "express";
import { userController } from "./user.controller";

const router = Router();
router.post('/',userController.createAdmin);
export const userRoutes = router;
