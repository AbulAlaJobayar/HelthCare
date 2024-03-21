import { string, z } from "zod";

const updateAdminSchema = z.object({
        body: z.object({
          name: string().optional(),
          contactNumber: z.string().optional(),
        }),
      });
      
      export const adminValidationSchema={
        updateAdminSchema
      }