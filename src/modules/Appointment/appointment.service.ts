import { JwtPayload } from "jsonwebtoken";
import { prisma } from "../../shared/prisma";
import { v4 as uuidv4 } from "uuid";
import { TPaginationOption } from "../../interfaces/pagination";
import paginationHelper from "../../helper/paginationHelper";
import {
  AppointmentStatus,
  PaymentStatus,
  Prisma,
  UserRole,
} from "@prisma/client";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";

const insertIntoDB = async (
  user: JwtPayload,
  payload: {
    doctorId: string;
    scheduleId: string;
  }
) => {
  const patientData = await prisma.patient.findUniqueOrThrow({
    where: {
      email: user.email,
    },
  });
  const doctorData = await prisma.doctor.findUniqueOrThrow({
    where: {
      id: payload.doctorId,
    },
  });

  const doctorScheduleId = await prisma.doctorSchedule.findFirstOrThrow({
    where: {
      doctorId: doctorData.id,
      scheduleId: payload.scheduleId,
      isBooked: false,
    },
  });
  const videoCallingId = uuidv4();
  const result = await prisma.$transaction(async (tx) => {
    const appointmentData = await tx.appointment.create({
      data: {
        patientId: patientData.id,
        doctorId: doctorData.id,
        scheduleId: payload.scheduleId,
        videoCallingId: videoCallingId,
      },
      include: {
        patient: true,
        doctor: true,
        schedule: true,
      },
    });
    await tx.doctorSchedule.update({
      where: {
        doctorId_scheduleId: {
          doctorId: doctorData.id,
          scheduleId: payload.scheduleId,
        },
      },
      data: {
        isBooked: true,
        appointmentId: appointmentData.id,
      },
    });

    // create payment
    const today = new Date();

    // ph_health_Care_2024_01_22_11_30_22
    const transactionId =
      "ph_health_Care" +
      today.getFullYear() +
      "_" +
      today.getMonth() +
      "_" +
      today.getDay() +
      "_" +
      today.getHours() +
      "_" +
      today.getMinutes() +
      "_" +
      today.getSeconds();
    await tx.payment.create({
      data: {
        appointmentId: appointmentData.id,
        amount: doctorData.appointmentFee,
        transactionId,
      },
    });
    return appointmentData;
  });
  return result;
};
const getMyAppointment = async (
  user: JwtPayload,
  query: any,
  option: TPaginationOption
) => {
  const { limit, page, skip, sortBy, sortOrder } = paginationHelper(option);
  const { ...filteredData } = query;
  const andCondition: Prisma.AppointmentWhereInput[] = [];
  if (user?.role === UserRole.PATIENT) {
    andCondition.push({
      patient: {
        email: user.email,
      },
    });
  } else if (user?.role === UserRole.DOCTOR) {
    andCondition.push({
      doctor: {
        email: user.email,
      },
    });
  }
  if (Object.keys(filteredData).length > 0) {
    andCondition.push({
      AND: Object.keys(filteredData).map((key) => ({
        [key]: {
          equals: (filteredData as any)[key],
        },
      })),
    });
  }

  const whereCondition: Prisma.AppointmentWhereInput = { AND: andCondition };
  const result = await prisma.appointment.findMany({
    where: whereCondition,
    skip,
    take: limit,
    orderBy: { [sortBy]: sortOrder },
    include:
      user?.role === UserRole.PATIENT
        ? { doctor: true }
        : { patient: { include: { medicalReport: true, Prescription: true } } },
  });
  const total = await prisma.appointment.count({
    where: whereCondition,
  });
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const changeAppointmentStatus = async (
  id: string,
  status: AppointmentStatus,
  user: JwtPayload
) => {
  const appointmentData = await prisma.appointment.findUniqueOrThrow({
    where: {
      id,
    },
    include: {
      doctor: true,
    },
  });

  console.log(appointmentData);
  if (user.role === UserRole.DOCTOR) {
    if (!(user.email === appointmentData.doctor.email)) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "this is not your appointment"
      );
    }
  }
  const result = await prisma.appointment.update({
    where: {
      id: appointmentData.id,
    },
    data: {
      status,
    },
  });
  return result;
};
const cancelUnpaidAppointments = async () => {
  const thirtyMinAgo = new Date(Date.now() - 30 * 60 * 1000);
  const unpaidAppointments = await prisma.appointment.findMany({
    where: {
      createdAt: {
        lte: thirtyMinAgo,
      },
      paymentStatus: PaymentStatus.UNPAID,
    },
  });

  const appointmentIdToCancel = unpaidAppointments.map(
    (appointment) => appointment.id
  );
  await prisma.$transaction(async (tx) => {
    await tx.payment.deleteMany({
      where: {
        appointmentId: {
          in: appointmentIdToCancel,
        },
      },
    });
    await tx.appointment.deleteMany({
      where: {
        id: {
          in: appointmentIdToCancel,
        },
      },
    });
    for (const unpaidAppointment of unpaidAppointments) {
      await tx.doctorSchedule.updateMany({
        where: {
          doctorId: unpaidAppointment.doctorId,
          scheduleId: unpaidAppointment.scheduleId,
        },
        data: {
          isBooked: false,
        },
      });
    }
  });
};
export const AppointmentService = {
  insertIntoDB,
  getMyAppointment,
  changeAppointmentStatus,
  cancelUnpaidAppointments,
};
