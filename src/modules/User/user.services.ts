import { Doctor, Patient, Prisma, UserRole } from "@prisma/client";
import * as bcrypt from "bcrypt";
import { prisma } from "../../shared/prisma";
import { fileUploader } from "../../helper/fileUploader";
import { IFile } from "../../interfaces/file";
import { Request } from "express";
import paginationHelper from "../../helper/paginationHelper";
import { TPaginationOption } from "../../interfaces/pagination";
import { userSearchAbleFields } from "./user.constant";
import { JwtPayload } from "jsonwebtoken";
const createAdmin = async (req: any) => {
  const payload = req.body;
  const file = req.file;
  if (file) {
    const uploadToCludinary = await fileUploader.uploadToCloudinary(file);
    console.log("user service", uploadToCludinary);
    payload.admin.profilePhoto = uploadToCludinary?.secure_url;
  }
  const hashedPassword: string = await bcrypt.hash(payload.password, 12);
  const userData = {
    email: payload.admin.email,
    password: hashedPassword,
    role: UserRole.ADMIN,
  };
  const result = await prisma.$transaction(async (transactionClient) => {
    await transactionClient.user.create({
      data: userData,
    });
    const createdAdminData = await transactionClient.admin.create({
      data: payload.admin,
    });
    return createdAdminData;
  });

  return result;
};

const createDoctor = async (req: Request): Promise<Doctor> => {
  const file = req.file as IFile;

  if (file) {
    const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
    req.body.doctor.profilePhoto = uploadToCloudinary?.secure_url;
  }

  const hashedPassword: string = await bcrypt.hash(req.body.password, 12);

  const userData = {
    email: req.body.doctor.email,
    password: hashedPassword,
    role: UserRole.DOCTOR,
  };

  const result = await prisma.$transaction(async (transactionClient) => {
    await transactionClient.user.create({
      data: userData,
    });

    const createdDoctorData = await transactionClient.doctor.create({
      data: req.body.doctor,
    });

    return createdDoctorData;
  });

  return result;
};
const createPatient = async (req: Request): Promise<Patient> => {
  const file = req.file;

  if (file) {
    const uploadedProfileImage = await fileUploader.uploadToCloudinary(file);
    req.body.patient.profilePhoto = uploadedProfileImage?.secure_url;
  }

  const hashPassword = await bcrypt.hash(req.body.password, 12);
  const result = await prisma.$transaction(async transactionClient => {
    const newUser = await transactionClient.user.create({
      data: {
        email: req.body.patient.email,
        password: hashPassword,
        role: UserRole.PATIENT,
      },
    });
    const newPatient = await transactionClient.patient.create({
      data: req.body.patient,
    });

    return newPatient;
  });

  return result;
};



const getAllFromDB = async (params: any, options: TPaginationOption) => {
  const { page, limit, skip } = paginationHelper(options);
  const { searchTerm, ...filterData } = params;

  const andCondions: Prisma.UserWhereInput[] = [];

  //console.log(filterData);
  if (params.searchTerm) {
    andCondions.push({
      OR: userSearchAbleFields.map((field) => ({
        [field]: {
          contains: params.searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andCondions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }
console.dir(andCondions,{depth:null})
  const whereConditons: Prisma.UserWhereInput =
    andCondions.length > 0 ? { AND: andCondions } : {};

  const result = await prisma.user.findMany({
    where: whereConditons,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? {
            [options.sortBy]: options.sortOrder,
          }
        : {
            createdAt: "desc",
          },
    select: {
      id: true,
      email: true,
      role: true,
      needPasswordChanged: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      admin: true,
      // patient: true,
      doctor: true,
    },
  });

  const total = await prisma.user.count({
    where: whereConditons,
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
const getMyProfile = async (payload: JwtPayload) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
    },
  });

  let profileInfo;
  if (userData.role === UserRole.SUPPER_ADMIN) {
    profileInfo = await prisma.admin.findUnique({
      where: {
        email: userData.email,
      },
    });
  } else if (userData.role === UserRole.ADMIN) {
    profileInfo = await prisma.admin.findUnique({
      where: {
        email: userData.email,
      },
    });
  } else if (userData.role === UserRole.DOCTOR) {
    profileInfo = await prisma.doctor.findUnique({
      where: {
        email: userData.email,
      },
    });
  } else if (userData.role === UserRole.PATIENT) {
    profileInfo = await prisma.patient.findUnique({
      where: {
        email: userData.email,
      },
    });

    return { ...userData, ...profileInfo };
  }
};

const updateMyProfile = async (user: JwtPayload, req: Request) => {
  let file = req.file as IFile;
  if (file) {
    const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
    req.body.profilePhoto = uploadToCloudinary?.secure_url;
  }
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: user.email,
    },
  });

  let updateProfileInfo;
  if (userData.role === UserRole.SUPPER_ADMIN) {
    updateProfileInfo = await prisma.admin.update({
      where: {
        email: userData.email,
      },
      data: req.body,
    });
  } else if (userData.role === UserRole.ADMIN) {
    updateProfileInfo = await prisma.admin.update({
      where: {
        email: userData.email,
      },
      data:  req.body,
    });
  } else if (userData.role === UserRole.DOCTOR) {
    updateProfileInfo = await prisma.doctor.update({
      where: {
        email: userData.email,
      },
      data:  req.body,
    });
  } else if (userData.role === UserRole.PATIENT) {
    updateProfileInfo = await prisma.patient.findUnique({
      where: {
        email: userData.email,
      },
    });

    return updateProfileInfo;
  }
};

export const userService = {
  createAdmin,
  createDoctor,
  createPatient,
  getAllFromDB,
  getMyProfile,
  updateMyProfile,
};
