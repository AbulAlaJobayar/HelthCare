import { prisma } from "./../../shared/prisma";
import { Admin, Prisma, PrismaClient, UserStatus } from "@prisma/client";
import { adminSearchableField } from "./admin.constant";
import paginationHelper from "../../helper/paginationHelper";
import { TPaginationOption } from "../../interfaces/pagination";
import { TAdminFilterRequest } from "./admin.interfaces";

const getAllFromDB = async (query: TAdminFilterRequest, option: TPaginationOption) => {
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
          equals: (filteredData as any)[key],
        },
      })),
    });
  }
  andCondition.push({
    isDeleted:false
  })
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
      isDeleted:false
    },
  });
  return result;
};

const updateIntoDB = async (id: string, payload: Partial<Admin>) => {
  await prisma.admin.findUniqueOrThrow({
    where: { 
      id ,
      isDeleted:false
    },
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
        isDeleted:false
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

const adminSoftDeleteIntoDB = async (id: string) => {
await prisma.admin.findUniqueOrThrow({
  where:{
    id,
    isDeleted:false
  }
})
  
  const result = await prisma.$transaction(async (transactionClient) => {
    const adminSoftDelete = await transactionClient.admin.update({
      where: {
        id,
        isDeleted:false
      },
      data: {
        isDeleted: true,
      },
    });
    const userDelete = await transactionClient.user.update({
      where: {
        email: adminSoftDelete.email,
      },
      data: {
        status: UserStatus.DELETE,
      },
    });
    return userDelete
  });
  return result
};
export const adminService = {
  getAllFromDB,
  getByIdFromDB,
  updateIntoDB,
  deleteIntoDB,
  adminSoftDeleteIntoDB
};
