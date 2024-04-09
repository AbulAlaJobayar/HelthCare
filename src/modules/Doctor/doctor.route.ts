import { Router } from "express";
import { DoctorController } from "./doctor.controller";


const route=Router()
route.get('/', DoctorController.getAllDoctorFromDb)
route.get('/:id', DoctorController.getByIdFromDB)
route.patch('/:id', DoctorController.updateIntoDB)
route.delete('/:id', DoctorController.deleteByIdFromDB)
route.delete('/soft/:id', DoctorController.deleteByIdFromDB)

export const DoctorRoute=route