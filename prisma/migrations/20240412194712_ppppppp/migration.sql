-- AddForeignKey
ALTER TABLE "doctorSchedule" ADD CONSTRAINT "doctorSchedule_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "appointments"("id") ON DELETE SET NULL ON UPDATE CASCADE;
