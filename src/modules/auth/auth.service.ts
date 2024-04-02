import { Secret } from "jsonwebtoken";
import { prisma } from "./../../shared/prisma";
import * as bcrypt from "bcrypt";
import { generateToken, verifyToken } from "../../helper/jwtHelpers";
import { UserStatus } from "@prisma/client";
import config from "../../config";
import emailSender from "./emailSender";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
const loginUser = async (payload: { email: string; password: string }) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
      status: UserStatus.ACTIVE,
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
  const accessToken = generateToken(
    tokenData,
    config.jwt.jwtSecret as Secret,
    config.jwt.jwtExpires as string
  );

  const refreshToken = generateToken(
    tokenData,
    config.jwt.refreshSecret as Secret,
    config.jwt.refreshExpire as string
  );

  return {
    accessToken,
    refreshToken,
    needPasswordChanged: userData.needPasswordChanged,
  };
};

const refreshToken = async (token: string) => {
  const decoded = verifyToken(token, config.jwt.refreshSecret as Secret);
  if (!decoded) {
    throw new Error("Unauthorized user");
  }
  const isUserExit = await prisma.user.findUniqueOrThrow({
    where: {
      email: decoded?.email,
      status: UserStatus.ACTIVE,
    },
  });
  const tokenData = {
    email: isUserExit.email,
    role: isUserExit.role,
  };
  const accessToken = generateToken(
    tokenData,
    config.jwt.jwtSecret as Secret,
    config.jwt.jwtExpires as string
  );
  return {
    accessToken,
    needPasswordChanged: isUserExit.needPasswordChanged,
  };
};

const changedPassword = async (user: any, payload: any) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: user.email,
      status: UserStatus.ACTIVE,
    },
  });
  const isCorrectPassword = await bcrypt.compare(
    payload.password,
    userData.password
  );

  if (!isCorrectPassword) {
    throw new Error("password is incorrect");
  }
  const hashedPassword: string = await bcrypt.hash(payload.password, 12);

  await prisma.user.update({
    where: {
      email: userData.email,
    },
    data: {
      password: hashedPassword,
      needPasswordChanged: false,
    },
  });
};
const forgotPassword = async (payload: { email: string }) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
      status: UserStatus.ACTIVE,
    },
  });
  const resPassToken = generateToken(
    { email: userData.email, role: userData.role },
    config.jwt.forgotPassSecret as Secret,
    config.jwt.forgotPassExp as string
  );
  //generateUrl

  //http://localhost:3000/resetPass?email=abcd@gmail.com&token=asdfghjk
  const res_pass_link = `${config.resPassLink}/reset_pass?id=${userData.id}&token=${resPassToken}`;
  console.log(res_pass_link);

  emailSender(
    userData.email,
    `
  <div>
  <p>Hello Dear,</P>
  <p>Your password Link</p>
  <a href=${res_pass_link}>
  <button>Reset Password</button>
  </a>
  </div>
  `
  );
};


const resetPassword=async(token:string,payload:{id:string,password:string})=>{
await prisma.user.findUniqueOrThrow({
    where:{
      id:payload.id,
      status:UserStatus.ACTIVE
    }
  })
  const isVAlidToken=verifyToken(token,config.jwt.forgotPassSecret as Secret,)
  
  if(!isVAlidToken){
    throw new AppError(httpStatus.UNAUTHORIZED," user unAuthorized")
  }
  const hashedPassword: string = await bcrypt.hash(payload.password, 12);

  await prisma.user.update({
    where: {
      id: payload.id,
    },
    data: {
      password: hashedPassword,
      needPasswordChanged: false,
    },
  })
  return null


}
export const AuthService = {
  loginUser,
  refreshToken,
  changedPassword,
  forgotPassword,
  resetPassword
  
};
