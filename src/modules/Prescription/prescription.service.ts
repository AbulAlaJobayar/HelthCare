import { JwtPayload } from "jsonwebtoken";
import { prisma } from "../../shared/prisma";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import { Prescription } from "@prisma/client";
import paginationHelper from "../../helper/paginationHelper";

const insertIntoDB = async (user: JwtPayload, payload: Partial<Prescription>) => {
  console.log("prescription completed");
  const appointmentData = await prisma.appointment.findUniqueOrThrow({
    where: {
      id: payload.appointmentId,
    },
    include: {
      doctor: true,
    },
  });
  if (!(user.email === appointmentData.doctor.email)) {
    throw new AppError(httpStatus.BAD_REQUEST, "this is not your appointment");
  }
  const result = await prisma.prescription.create({
    data: {
      appointmentId: appointmentData.id,
      doctorId: appointmentData.doctorId,
      patientId: appointmentData.patientId,
      instructions: payload.instructions as string ,
      followUpDate: payload.followUpDate ||null ,
    },
    include:{
      doctor:true,
      patient:true
    }
  });
  return result;
};
const patientPrescription=async(user:JwtPayload,filter:any)=>{
  const { limit, page, skip, sortBy, sortOrder } = paginationHelper(filter);
  const result= await prisma.prescription.findMany({
    where:{
      patient:{
        email:user.email
      },
    },
    skip,
    take:limit,
    orderBy:{[sortBy]:sortOrder},
    include:{
      doctor:true,
      patient:true,
      appointment:true
    }
  })
  const total =await prisma.prescription.count({
    where:{
      patient:{
        email:user.email
      }
     
    }
  })
  return {
    meta:{
      total,
      page,
      limit
    },
    data:result
  }
}
export const PrescriptionService = {
  insertIntoDB,
  patientPrescription
};
