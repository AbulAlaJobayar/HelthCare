import { JwtPayload } from "jsonwebtoken";
import { prisma } from "../../shared/prisma";
import { Review } from "@prisma/client";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";

const insertIntoDB = async (user: JwtPayload, payload: Partial<Review>) => {
  const patientData = await prisma.patient.findUniqueOrThrow({
    where: {
      email: user.email,
    },
  });

  const appointmentData = await prisma.appointment.findUniqueOrThrow({
    where: {
      id: payload.appointmentId,
    },
  });
  if (!(patientData.id === appointmentData.patientId)) {
    throw new AppError(httpStatus.BAD_REQUEST, "this is not your appointment");
  }
  const result = await prisma.review.create({
    data: {
      appointmentId: appointmentData.id,
      doctorId: appointmentData.doctorId,
      patientId: appointmentData.patientId,
      rating: payload.rating as number,
      comment: payload.comment as string,
    },
  });
  return result;
};
export const ReviewService = {
  insertIntoDB,
};
