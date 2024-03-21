import { Router } from "express";
import { userRoutes } from "../modules/User/user.routes";
import { adminRoute } from "../modules/Admin/admin.route";

const router=Router()
const moduleRoutes=[
        {
                path:"/user",
                route:userRoutes
        },
        {
                path:"/admin",
                route: adminRoute
        }

]
moduleRoutes.forEach((route)=>router.use(route.path,route.route))

export default router