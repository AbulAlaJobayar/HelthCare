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
  return await prisma.$transaction(async (tx) => {
    const review = await tx.review.create({
      data: {
        appointmentId: appointmentData.id,
        doctorId: appointmentData.doctorId,
        patientId: appointmentData.patientId,
        rating: payload.rating as number,
        comment: payload.comment as string,
      },
    });
    const averageRating = await tx.review.aggregate({
      _avg: {
        rating: true,
      },
    });
    await tx.doctor.update({
      where: {
        id: review.doctorId,
      },
      data: {
        averageRating: averageRating._avg.rating as number,
      },
    });
    return review
  });
  //return result;
};
export const ReviewService = {
  insertIntoDB,
};
