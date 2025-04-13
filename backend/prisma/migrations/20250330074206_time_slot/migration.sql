/*
  Warnings:

  - You are about to drop the column `timeSlot` on the `Appointment` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[timeSlotId]` on the table `Appointment` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `timeSlotId` to the `Appointment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Appointment" DROP COLUMN "timeSlot",
ADD COLUMN     "timeSlotId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Appointment_timeSlotId_key" ON "Appointment"("timeSlotId");

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_timeSlotId_fkey" FOREIGN KEY ("timeSlotId") REFERENCES "TimeSlot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
