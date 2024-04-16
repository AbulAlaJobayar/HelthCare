import { Router } from "express";
import { PaymentController } from "./payment.controller";


const route=Router()
route.get('/ipn',PaymentController.validatePayment)
route.post('/init-payment/:id',PaymentController.initPayment)

export const PaymentRoute=route