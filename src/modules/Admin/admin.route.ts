
import { Router } from "express";
import { adminController } from "./admin.controller";


const router= Router();
router.get("/",adminController.getAllFromDB)
router.get("/:id",adminController.getByIdFromDB)
router.patch("/:id",adminController.updateIntoDB)
router.delete("/:id",adminController.deleteIntoDB)

export const adminRoute=router