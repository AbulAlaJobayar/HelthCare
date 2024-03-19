import express, { Application, Request, Response } from "express"
import cors from "cors"
import { userRoutes } from "./modules/User/user.routes"
import { adminRoute } from "./modules/Admin/admin.route"
//import { userRouter } from "./modules/User/user.route"
const app:Application = express()
//parser
app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.get('/',async(req:Request,res:Response)=>{
 res.send("Ph HealthCare")
})
app.use('/api/v1/user',userRoutes)
app.use("/api/v1/admin",adminRoute)
export default app