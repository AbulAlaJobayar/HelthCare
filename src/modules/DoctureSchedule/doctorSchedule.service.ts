import { JwtPayload } from "jsonwebtoken";
import { prisma } from "../../shared/prisma";
import paginationHelper from "../../helper/paginationHelper";
import { Prisma } from "@prisma/client";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";

const insertIntoDB = async (
  user: JwtPayload,
  payload: {
    scheduleIds: string[];
  }
) => {
  const doctorData = await prisma.doctor.findUniqueOrThrow({
    where: {
      email: user.email,
    },
  });
  const doctorScheduleData = payload.scheduleIds.map((scheduleId) => ({
    doctorId: doctorData.id,
    scheduleId,
  }));

  const result = await prisma.doctorSchedule.createMany({
    data: doctorScheduleData,
  });
  return result;
};

const getMySchedule = async (query: any, option: any, user: JwtPayload) => {
  const { startDate, endDate, ...rest } = query;

  const { limit, page, skip, sortBy, sortOrder } = paginationHelper(option);
  let andCondition: Prisma.DoctorScheduleWhereInput[] = [];
  if (startDate && endDate) {
    andCondition.push({
      AND: [
        {
          schedule: {
            startDateTime: {
              gte: startDate,
            },
          },
        },
        {
          schedule: {
            endDateTime: {
              lte: endDate,
            },
          },
        },
      ],
    });
  }
  if (Object.keys(rest).length > 0) {
    if (typeof rest.isBooked === "string" && rest.isBooked === "true") {
      rest.isBooked = true;
    } else if (typeof rest.isBooked === "string" && rest.isBooked === "false") {
      rest.isBooked = false;
    }
    andCondition.push({
      AND: Object.keys(rest).map((key) => ({
        [key]: {
          equals: rest[key],
        },
      })),
    });
  }
  const whereCondition: Prisma.DoctorScheduleWhereInput = { AND: andCondition };
  const result = await prisma.doctorSchedule.findMany({
    where: whereCondition,
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
  });

  const total = await prisma.doctorSchedule.count({
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

const deleteIntoDB = async (user: JwtPayload, scheduleId: string) => {
  const doctorData = await prisma.doctor.findUniqueOrThrow({
    where: {
      email: user.email,
    },
  });
  const isBooked = await prisma.doctorSchedule.findUnique({
    where: {
      doctorId_scheduleId: {
        doctorId: doctorData.id,
        scheduleId: scheduleId,
      },
      isBooked: true,
    },
  });
  if( isBooked){
    throw new AppError(httpStatus.BAD_REQUEST,"schedule can't delete , because this schedule is booked")
  }

  const result = await prisma.doctorSchedule.delete({
    where: {
      doctorId_scheduleId: {
        doctorId: doctorData?.id,
        scheduleId: scheduleId,
      },
    },
  });
  return result;
 
};
export const DoctorScheduleService = {
  insertIntoDB,
  getMySchedule,
  deleteIntoDB,
};
