import { Prisma, PrismaClient } from "@prisma/client";
import { adminSearchableField } from "./admin.constant";
import paginationHelper from "../../helper/paginationHelper";
import { prisma } from "../../shared/prisma";



const getAllFromDB = async (query: any,option:any) => {
  const {limit,page,skip,sortBy,sortOrder}=paginationHelper(option)
  const {searchTerm,...filteredData}=query
  const andCondition: Prisma.AdminWhereInput[] = [];
  if (query.searchTerm) {
    andCondition.push({
      OR: adminSearchableField.map((field) => ({
        [field]: {
          contains: query.searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }
if(Object.keys(filteredData).length>0){
andCondition.push({
 AND:Object.keys(filteredData).map((key)=>({
  [key]:{
    equals:filteredData[key]
  }
 })) 
})
}
  const whereCondition: Prisma.AdminWhereInput = { AND: andCondition };
  const result = await prisma.admin.findMany({
    where: whereCondition,
    skip,
    take:limit,
    orderBy:{[sortBy]:sortOrder}
  });
  const total=await prisma.admin.count({
    where:whereCondition
  })
  return {
    meta:{
      page,
      limit,
      total
    },
    data:result
  };
};

export const adminService = {
  getAllFromDB,
};
