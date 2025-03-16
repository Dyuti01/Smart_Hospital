/*
  Warnings:

  - Added the required column `patientEmail` to the `Appointment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `patientName` to the `Appointment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `patientPhone` to the `Appointment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Appointment" ADD COLUMN     "patientEmail" TEXT NOT NULL,
ADD COLUMN     "patientName" TEXT NOT NULL,
ADD COLUMN     "patientPhone" TEXT NOT NULL;
