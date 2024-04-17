import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors";
import router from "./routes";
import { globalErrorHandler } from "./middlewares/globalErrorHandler";
import cookieParser from 'cookie-parser'
import { NotFound } from "./middlewares/NotFound";
import { AppointmentService } from "./modules/Appointment/appointment.service";
import cron from 'node-cron'
const app: Application = express();
app.use(cors());
//parser

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())

app.get("/", async (req: Request, res: Response) => {
  res.send("Ph HealthCare");
});
app.use("/api/v1/", router);

cron.schedule('* * * * *', () => {
 AppointmentService.cancelUnpaidAppointments();
});

app.use(globalErrorHandler);
// app.use((err:any,req:Request,res:Response,next:NextFunction)=>{
// res.status(500).json({
//   success:false,
//   message:err?.message || "something went wrong",
//   error:err
// })
// })

app.use(NotFound);
// app.use((req, res, next) => {
//   res.status(httpStatus.NOT_FOUND).json({
//     success: false,
//     message: "Api not found",
//     err: {
//       path: req.originalUrl,
//     },
//   });
// });
export default app;
