import { Request } from "express";
import { fileUploader } from "../../helper/fileUploader";
import { prisma } from "../../shared/prisma";

const insertIntoDB = async (req: Request) => {
  const file = req.file;
  if (file) {
    const uploadToCludinary = await fileUploader.uploadToCloudinary(file);
    req.body.icon = uploadToCludinary?.secure_url;
  }
  const result = await prisma.specialties.create({
    data: req.body,
  });
  return result;
};

const getAllSpecialties = async () => {
  const result = await prisma.specialties.findMany();
  return result
};
const deleteSpecialties= async(id:string)=>{
await prisma.specialties.delete({
  where:{
    id
  }
})
return null
}

export const SpecialtiesService = {
  insertIntoDB,
  getAllSpecialties,
  deleteSpecialties

};
