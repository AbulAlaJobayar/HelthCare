import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });
export default {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  jwt: {
    jwtSecret: process.env.JWT_SECRET,
    jwtExpires: process.env.EXPIRES_IN,
    refreshSecret: process.env.REFRESH_SECRET,
    refreshExpire: process.env.REFRESH_SECRET_EXPIRES_IN,
    forgotPassSecret: process.env.FORGOT_PASS_SECRET,
    forgotPassExp: process.env.FORGOT_PASS_SECRET_EXPIRES_IN,
  },
  resPassLink: process.env.RESET_PASS_LINK,
  email: process.env.NODEMAILER_EMAIL,
  pass: process.env.NODEMAILER_EMAIL_PASS,
  ssl: {
    store_id: process.env.STORE_ID,
    store_pass: process.env.STORE_PASS,
    success_url: process.env.SUCCESS_URL,
    fail_url: process.env.FAIL_URL,
    cancel_url: process.env.CANCEL_URL,
    sandbox_url: process.env.SANDBOX_URL,
    validationApi:process.env.VALIDATION_API
  },
};
