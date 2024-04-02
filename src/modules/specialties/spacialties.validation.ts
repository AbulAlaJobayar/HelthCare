import { z } from "zod";
const specialtiesSchemaValidation = z.object({
  title: z.string({
    required_error: "title is required",
  }),
});
export const SpecialtiesSchema = {
  specialtiesSchemaValidation,
};
