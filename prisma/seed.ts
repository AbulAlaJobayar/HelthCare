import { UserRole, UserStatus } from "@prisma/client";
import { prisma } from "../src/shared/prisma";
import config from "../src/config";
import bcrypt from "bcrypt";

const seedSuperAdmin = async () => {
  try {
    const isExist = await prisma.user.findFirst({
      where: {
        role: UserRole.SUPPER_ADMIN,
      },
    });
    if (isExist) {
      console.log("Super Admin already exist");
      return;
    }
    const password = await bcrypt.hash(
      config.supperAdmin.supperAdminPassword as string,
      Number(12)
    );

    const supperAdmin = await prisma.user.create({
      data: {
        email: config.supperAdmin.supperAdminEmail as string,
        password: password,
        role: UserRole.SUPPER_ADMIN,
        admin: {
          create: {
            name: config.supperAdmin.supperAdminName as string,
            contactNo: config.supperAdmin.supperAdminContactNo as string,
          },
        },
      },
    });
    console.log("supperAdminCreated", supperAdmin);
  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
};

seedSuperAdmin();
