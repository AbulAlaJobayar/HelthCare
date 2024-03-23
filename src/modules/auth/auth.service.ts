import { Secret } from 'jsonwebtoken';
import { prisma } from "./../../shared/prisma";
import * as bcrypt from "bcrypt";
import { generateToken, verifyToken } from "../../helper/jwtHelpers";
import { UserStatus } from "@prisma/client";
import config from "../../config";
const loginUser = async (payload: { email: string; password: string }) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
      status:UserStatus.ACTIVE
    },
  });
  const isCorrectPassword = await bcrypt.compare(
    payload.password,
    userData.password
  );

  if (!isCorrectPassword) {
    throw new Error("password is incorrect");
  }

  const tokenData = {
    email: userData.email,
    role: userData.role,
  };
  const accessToken = generateToken(tokenData, config.jwt.jwtSecret as Secret, config.jwt.jwtExpires as string);

  const refreshToken = generateToken(tokenData, config.jwt.refreshSecret as Secret, config.jwt.refreshExpire as string);

  return {
    accessToken,
    refreshToken,
    needPasswordChanged: userData.needPasswordChanged,
  };
};

const refreshToken = async (token: string) => {
  const decoded = verifyToken(token,config.jwt.refreshSecret as Secret)
  if (!decoded) {
    throw new Error("Unauthorized user");
  }
  const isUserExit = await prisma.user.findUniqueOrThrow({
    where: {
      email: decoded?.email,
      status:UserStatus.ACTIVE
    },
  });
  const tokenData = {
    email: isUserExit.email,
    role: isUserExit.role,
  };
  const accessToken = generateToken(tokenData, config.jwt.jwtSecret as Secret, config.jwt.jwtExpires as string);
  return {
    accessToken,
    needPasswordChanged: isUserExit.needPasswordChanged,
  };
};


const changedPassword=async(user:any, payload:any)=>{
 const userData=await prisma.user.findUniqueOrThrow({
  where:{
    email:user.email,
    status:UserStatus.ACTIVE
  }
 })
 const isCorrectPassword = await bcrypt.compare(
  payload.password,
  userData.password
);

if (!isCorrectPassword) {
  throw new Error("password is incorrect");
}
const hashedPassword:string =await bcrypt.hash(payload.password, 12);

await prisma.user.update({
  where:{
    email:userData.email
  },
  data:{
    password:hashedPassword,
    needPasswordChanged:false
  }
})

 
}
export const AuthService = {
  loginUser,
  refreshToken,
  changedPassword
};
