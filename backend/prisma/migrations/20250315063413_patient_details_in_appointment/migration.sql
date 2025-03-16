/*
  Warnings:

  - You are about to drop the column `patientEmail` on the `Appointment` table. All the data in the column will be lost.
  - You are about to drop the column `patientName` on the `Appointment` table. All the data in the column will be lost.
  - You are about to drop the column `patientPhone` on the `Appointment` table. All the data in the column will be lost.
  - Added the required column `patientPersonEmail` to the `Appointment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `patientPersonName` to the `Appointment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `patientPersonPhone` to the `Appointment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Appointment" DROP COLUMN "patientEmail",
DROP COLUMN "patientName",
DROP COLUMN "patientPhone",
ADD COLUMN     "patientPersonEmail" TEXT NOT NULL,
ADD COLUMN     "patientPersonName" TEXT NOT NULL,
ADD COLUMN     "patientPersonPhone" TEXT NOT NULL;
