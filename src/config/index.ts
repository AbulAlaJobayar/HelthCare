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
  },
};
