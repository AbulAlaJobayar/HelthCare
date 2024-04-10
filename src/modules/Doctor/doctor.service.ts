import { Prisma, UserStatus } from "@prisma/client";
import { prisma } from "../../shared/prisma";
import paginationHelper from "../../helper/paginationHelper";

const getAllDoctorFromDb = async (query: any, filter: any) => {
  // console.log(query);
  const { limit, page, skip, sortBy, sortOrder } = paginationHelper(filter);

  const { searchTerm, specialties, ...filterData } = query;

  let andCondition: Prisma.DoctorWhereInput[] = [];
  if (searchTerm) {
    andCondition.push({
      OR: ["name", "email", "contactNumber"].map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }
  if (specialties && specialties.length > 0) {
    andCondition.push({
      doctorSpecialties: {
        some: {
          specialties: {
            title: {
              contains: specialties,
              mode: "insensitive",
            },
          },
        },
      },
    });
  }

  if (Object.keys(filterData).length > 0) {
    andCondition.push({
      AND: Object.keys(filterData).map((item) => ({
        [item]: {
          equals: filterData[item],
          mode: "insensitive",
        },
      })),
    });
  }
  const whereConditions: Prisma.DoctorWhereInput =
    andCondition.length > 0 ? { AND: andCondition } : {};
  // console.dir(whereConditions, { depth: null });

  const result = await prisma.doctor.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: { [sortBy]: sortOrder },
    include: {
      doctorSpecialties: {
        include: {
          specialties: true,
        },
      },
    },
  });
  const total = await prisma.doctor.count({});
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
  const result = await prisma.doctor.findUnique({
    where: {
      id,
    },
  });
  return result;
};

const updateIntoDB = async (id: string, payload: any) => {
  const { specialties, ...doctorData } = payload;
  const doctorInfo = await prisma.doctor.findUniqueOrThrow({
    where: {
      id,
    },
  });

  await prisma.$transaction(async (tr) => {
    const updateDoctor = await tr.doctor.update({
      where: {
        id,
      },
      data: doctorData,
    });

    if (specialties && specialties.length > 0) {
      //delete specialties
      const deleteSpecialties = specialties.filter(
        (specialty: any) => specialty.isDeleted
      );
      for (const specialty of deleteSpecialties) {
        await tr.doctorSpecialties.deleteMany({
          where: {
            doctorId: doctorInfo.id,
            specialtiesId: specialty.specialtiesId,
          },
        });
      }
      //create Specialties
      const createSpecialties = specialties.filter(
        (specialty: any) => !specialty.isDeleted
      );
      console.log(createSpecialties);

      for (const specialty of createSpecialties) {
        await tr.doctorSpecialties.create({
          data: {
            doctorId: doctorInfo.id,
            specialtiesId: specialty.specialtiesId,
          },
        });
      }
    }
  });
  const result = await prisma.doctor.findUnique({
    where: {
      id: doctorInfo.id,
    },
    include: {
      doctorSpecialties: {
        include: {
          specialties: true,
        },
      },
    },
  });
  return result;
};

const deleteByIdFromDB = async (id: string) => {
  const result = await prisma.$transaction(async (tr) => {
    const deleteDoctor = tr.doctor.delete({
      where: {
        id,
      },
    });
    const userDelete = await tr.user.delete({
      where: {
        email: (await deleteDoctor).email,
      },
    });
    return userDelete;
  });
  return result;
};
const softDelete = async (id: string) => {
  const result = await prisma.$transaction(async (tr) => {
    const doctorSoftDelete = await tr.doctor.update({
      where: { id, isDeleted: false },
      data: {
        isDeleted: true,
      },
    });
    const userSoftDelete = await tr.user.update({
      where: {
        email: doctorSoftDelete.email,
        status: UserStatus.ACTIVE,
      },
      data: {
        status: UserStatus.DELETE,
      },
    });
    return userSoftDelete;
  });
  return result;
};

export const DoctorService = {
  getAllDoctorFromDb,
  getByIdFromDB,
  updateIntoDB,
  deleteByIdFromDB,
  softDelete,
};
