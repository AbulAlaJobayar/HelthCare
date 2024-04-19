import { Router } from "express";
import { userRoutes } from "../modules/User/user.routes";
import { adminRoute } from "../modules/Admin/admin.route";
import { AuthRouter } from "../modules/auth/auth.route";
import { SpecialtiesRoute } from "../modules/specialties/specialties.route";
import { DoctorRoute } from "../modules/Doctor/doctor.route";
import { PatientRoute } from "../modules/Patient/patient.route";
import { ScheduleRoute } from "../modules/Schedule/schedule.route";
import { DoctorScheduleRoute } from "../modules/DoctureSchedule/doctorSchedule.route";
import { AppointmentRoute } from "../modules/Appointment/appointment.route";
import { PaymentRoute } from "../modules/Payment/payment.route";
import { PrescriptionRoute } from "../modules/Prescription/prescription.routes";
import { ReviewRoute } from "../modules/Review/review.routes";
import { MetaRoutes } from "../modules/Meta/meta.routes";

const router=Router()
const moduleRoutes=[
        {
                path:"/user",
                route:userRoutes
        },
        {
                path:"/admin",
                route: adminRoute
        },
        {
                path:"/auth",
                route: AuthRouter
        },
        {
                path:"/specialties",
                route: SpecialtiesRoute
        },
        {
                path:"/doctor",
                route: DoctorRoute
        },
        {
                path:"/patient",
                route: PatientRoute
        },
        {
                path:"/schedule",
                route: ScheduleRoute
        },
        {
                path:"/doctor-schedule",
                route: DoctorScheduleRoute
        },
        {
                path:"/appointment",
                route: AppointmentRoute
        },
        {
                path:"/payment",
                route: PaymentRoute
        },
        {
                path:"/prescription",
                route: PrescriptionRoute
        },
        {
                path:"/review",
                route:ReviewRoute
        },
        {
                path:"/meta",
                route:MetaRoutes
        }

]
moduleRoutes.forEach((route)=>router.use(route.path,route.route))

export default router