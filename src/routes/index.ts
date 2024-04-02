import { Router } from "express";
import { userRoutes } from "../modules/User/user.routes";
import { adminRoute } from "../modules/Admin/admin.route";
import { AuthRouter } from "../modules/auth/auth.route";
import { SpecialtiesRoute } from "../modules/specialties/specialties.route";

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
        }

]
moduleRoutes.forEach((route)=>router.use(route.path,route.route))

export default router