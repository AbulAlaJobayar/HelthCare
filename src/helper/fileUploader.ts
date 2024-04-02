import multer from "multer";
import path from "path";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs"
import { ICloudinaryResponse, IFile } from "../interfaces/file";
cloudinary.config({
  cloud_name: "dfmkmvyas",
  api_key: "587847174634548",
  api_secret: "pPYut9seNYeuv9QRcqsqp3VdcZo",
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(process.cwd(), "uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

const uploadToCloudinary = async (file:IFile): Promise<ICloudinaryResponse | undefined>  => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(file.path,
    //{ public_id: file.originalname },
     (error:Error, result:ICloudinaryResponse) => {
      fs.unlinkSync(file.path)
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};


export const fileUploader = {
  upload,
  uploadToCloudinary,
};
