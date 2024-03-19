import { prisma } from "./../../shared/prisma";
import { Admin, Prisma, PrismaClient } from "@prisma/client";
import { adminSearchableField } from "./admin.constant";
import paginationHelper from "../../helper/paginationHelper";

const getAllFromDB = async (query: any, option: any) => {
  const { limit, page, skip, sortBy, sortOrder } = paginationHelper(option);
  const { searchTerm, ...filteredData } = query;
  const andCondition: Prisma.AdminWhereInput[] = [];
  if (query.searchTerm) {
    andCondition.push({
      OR: adminSearchableField.map((field) => ({
        [field]: {
          contains: query.searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }
  if (Object.keys(filteredData).length > 0) {
    andCondition.push({
      AND: Object.keys(filteredData).map((key) => ({
        [key]: {
          equals: filteredData[key],
        },
      })),
    });
  }
  const whereCondition: Prisma.AdminWhereInput = { AND: andCondition };
  const result = await prisma.admin.findMany({
    where: whereCondition,
    skip,
    take: limit,
    orderBy: { [sortBy]: sortOrder },
  });
  const total = await prisma.admin.count({
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

const getByIdFromDB = async (id: string) => {
  const result = await prisma.admin.findUnique({
    where: {
      id,
    },
  });
  return result;
};

const updateIntoDB = async (id: string, payload: Partial<Admin>) => {
  await prisma.admin.findUniqueOrThrow({
    where: { id },
  });

  const result = await prisma.admin.update({
    where: { id },
    data: payload,
  });
  return result;
};

const deleteIntoDB = async (id: string) => {
  const result = await prisma.$transaction(async (transactionClient) => {
    const adminDeleteData = await transactionClient.admin.delete({
      where: {
        id,
      },
    });
    await transactionClient.user.delete({
      where: {
        email: adminDeleteData.email,
      },
    });
    return adminDeleteData;
  });
  return result;
};
export const adminService = {
  getAllFromDB,
  getByIdFromDB,
  updateIntoDB,
  deleteIntoDB,
};
