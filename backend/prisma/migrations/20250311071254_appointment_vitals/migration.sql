/*
  Warnings:

  - Added the required column `status` to the `Appointment` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "AppointmentStatus" AS ENUM ('SCHEDULED', 'COMPLETED', 'CANCELLED');

-- AlterTable
ALTER TABLE "Appointment" ADD COLUMN     "duration" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "followUp" TEXT,
ADD COLUMN     "location" TEXT NOT NULL DEFAULT 'Ask at the counter',
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "reasonForVisit" TEXT,
ADD COLUMN     "status" "AppointmentStatus" NOT NULL,
ADD COLUMN     "vitalsId" TEXT;

-- CreateTable
CREATE TABLE "Vitals" (
    "id" TEXT NOT NULL,
    "bloodPressure" TEXT,
    "heartRate" INTEGER,
    "temperature" DOUBLE PRECISION,
    "oxygenSaturation" INTEGER,
    "appointmentId" TEXT NOT NULL,

    CONSTRAINT "Vitals_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Vitals_appointmentId_key" ON "Vitals"("appointmentId");

-- AddForeignKey
ALTER TABLE "Vitals" ADD CONSTRAINT "Vitals_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "Appointment"("appointmentId") ON DELETE CASCADE ON UPDATE CASCADE;
