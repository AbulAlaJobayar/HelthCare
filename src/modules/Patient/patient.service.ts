import { Patient, Prisma, UserStatus } from "@prisma/client";
import { prisma } from "../../shared/prisma";
import paginationHelper from "../../helper/paginationHelper";
import { IPatientFilterRequest, IPatientUpdate } from "./patient.interface";
import { promises } from "dns";

const getAllFromDB = async (query: any, option:any) => {
  const { searchTerm, ...rest } = query;

  const { limit, page, skip, sortBy, sortOrder } = paginationHelper(option);
  let andCondition: Prisma.PatientWhereInput[] = [];
  if (searchTerm) {
    andCondition.push({
      OR: ["name", "email"].map((key) => ({
        [key]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
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
  const whereCondition: Prisma.PatientWhereInput = { AND: andCondition };
  const result = await prisma.patient.findMany({
    where: whereCondition,
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
  });
  const total = await prisma.patient.count({});
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
  const result = await prisma.patient.findUnique({
    where: {
      id,
    },
  });
  return result;
};
const updateIntoDB = async (id: string, payload:Partial<IPatientUpdate>) => {
  const { patientHealthData, medicalReport, ...rest } = payload;

  const PatientInfo = await prisma.patient.findUniqueOrThrow({
    where: {
      id,
    },
  });
  const result = await prisma.$transaction(async (tr) => {
    await tr.patient.update({
      where: {
        id,
      },
      data: rest,
      include: {
        patientHelthData: true,
        medicalReport: true,
      },
    });
    if (patientHealthData) {
       await tr.patientHelthData.upsert({
        where: {
          patientId: PatientInfo.id,
        },
        update: patientHealthData,
        create: { ...patientHealthData, patientId: PatientInfo.id },
      });
    }
    if (medicalReport) {
      await tr.medicalReport.create({
        data: { ...medicalReport, patientId: PatientInfo.id },
      });
    }
  });
  return result
};

const deleteByIdFromDB = async (id: string) => {
  const result = await prisma.$transaction(async (tr) => {
  await tr.medicalReport.deleteMany({
    where:{
      patientId:id
    }
   })
   await tr.patientHelthData.delete({
    where:{
      patientId:id
    }
   })
   
    const deletePatient = await tr.patient.delete({
      where: { id },
    });
    const deleteUser = await tr.user.delete({
      where: {
        email: deletePatient.email,
      },
    });
    return null
  });
  return result;
};
const softDeleteByIdFromDB = async (id: string) => {
  const result = await prisma.$transaction(async (tr) => {
    const deletePatient = await tr.patient.update({
      where: { id },
      data: {
        isDeleted: true,
      },
    });
    const deleteUser = await tr.user.update({
      where: {
        email: deletePatient.email,
      },
      data: {
        status: UserStatus.DELETE,
      },
    });
    return {
      deletePatient,
      ...deleteUser,
    };
  });
  return result;
};
export const PatientService = {
  getAllFromDB,
  getByIdFromDB,
  updateIntoDB,
  deleteByIdFromDB,
  softDeleteByIdFromDB,
};
