import { addHours, addMinutes, format } from "date-fns";
import { prisma } from "../../shared/prisma";
import paginationHelper from "../../helper/paginationHelper";
import { Prisma } from "@prisma/client";
import { JwtPayload } from "jsonwebtoken";

const insertIntoDB = async (payload: any) => {
  const { startDate, endDate, startTime, endTime } = payload;
  const intervalTime = 30;
  const schedules = [];
  const currentDate = new Date(startDate);
  const lastDate = new Date(endDate);
  while (currentDate <= lastDate) {
    const startDateTime = new Date(
      addMinutes(
        addHours(
          `${format(currentDate, "yyyy-MM-dd")}`,
          Number(startTime.split(":")[0])
        ),
        Number(startTime.split(":")[1])
      )
    );

    const endDateTime = new Date(
      addMinutes(
        addHours(
          `${format(currentDate, "yyyy-MM-dd")}`,
          Number(endTime.split(":")[0])
        ),
        Number(endTime.split(":")[1])
      )
    );

    while (startDateTime < endDateTime) {
      const scheduleDate = {
        startDateTime: startDateTime,
        endDateTime: addMinutes(startDateTime, intervalTime),
      };
      const isExistingSchedule = await prisma.schedule.findFirst({
        where: {
          startDateTime: scheduleDate.startDateTime,
          endDateTime: scheduleDate.endDateTime,
        },
      });
      if (!isExistingSchedule) {
        const result = await prisma.schedule.create({
          data: scheduleDate,
        });
        schedules.push(result);
      }

      startDateTime.setMinutes(startDateTime.getMinutes() + intervalTime);
    }
    currentDate.setDate(currentDate.getDate() + intervalTime);
  }
  return schedules;
};

const getAllFromDB = async (query: any, option: any, user: JwtPayload) => {
  const { startDate, endDate, ...rest } = query;

  const { limit, page, skip, sortBy, sortOrder } = paginationHelper(option);
  let andCondition: Prisma.ScheduleWhereInput[] = [];
  if (startDate && endDate) {
    andCondition.push({
      AND: [
        {
          startDateTime: {
            gte: startDate,
          },
        },
        {
          endDateTime: {
            lte: endDate,
          },
        },
      ],
    });
  }
  if (Object.keys(rest).length > 0) {
    andCondition.push({
      AND: Object.keys(rest).map((key) => ({
        [key]: {
          equals: rest[key],
        },
      })),
    });
  }
  const doctorSchedule = await prisma.doctorSchedule.findMany({
    where: {
      doctor: {
        email: user.email,
      },
    },
  });
  const doctorScheduleIds = doctorSchedule.map((id) => id.scheduleId);
  console.log(doctorScheduleIds);
  const whereCondition: Prisma.ScheduleWhereInput = { AND: andCondition };
  const result = await prisma.schedule.findMany({
    where: {
      ...whereCondition,
      id: {
        notIn: doctorScheduleIds,
      },
    },
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
  });

  const total = await prisma.schedule.count({
    where: {
      ...whereCondition,
      id: {
        notIn: doctorScheduleIds,
      },
    },
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

export const ScheduleService = {
  insertIntoDB,
  getAllFromDB,
};
