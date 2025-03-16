/*
  Warnings:

  - You are about to drop the column `description` on the `Prescription` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[appointmentId]` on the table `Prescription` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Prescription" DROP COLUMN "description",
ADD COLUMN     "appointmentId" TEXT,
ADD COLUMN     "medications" JSONB[],
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "prescriptionUrl" TEXT,
ADD COLUMN     "tests" JSONB[];

-- CreateIndex
CREATE UNIQUE INDEX "Prescription_appointmentId_key" ON "Prescription"("appointmentId");

-- AddForeignKey
ALTER TABLE "Prescription" ADD CONSTRAINT "Prescription_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "Appointment"("appointmentId") ON DELETE SET NULL ON UPDATE CASCADE;
