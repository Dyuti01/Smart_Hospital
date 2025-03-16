/*
  Warnings:

  - The primary key for the `Address` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `address_id` on the `Address` table. All the data in the column will be lost.
  - The primary key for the `Schedule` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `schedule_id` on the `Schedule` table. All the data in the column will be lost.
  - You are about to drop the column `shift_id` on the `Schedule` table. All the data in the column will be lost.
  - You are about to drop the column `staff_id` on the `Schedule` table. All the data in the column will be lost.
  - The primary key for the `Shift` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `end_time` on the `Shift` table. All the data in the column will be lost.
  - You are about to drop the column `shift_id` on the `Shift` table. All the data in the column will be lost.
  - You are about to drop the column `shift_name` on the `Shift` table. All the data in the column will be lost.
  - You are about to drop the column `start_time` on the `Shift` table. All the data in the column will be lost.
  - You are about to drop the column `address_id` on the `Staff` table. All the data in the column will be lost.
  - You are about to drop the column `first_name` on the `Staff` table. All the data in the column will be lost.
  - You are about to drop the column `hire_date` on the `Staff` table. All the data in the column will be lost.
  - You are about to drop the column `last_name` on the `Staff` table. All the data in the column will be lost.
  - You are about to drop the column `shift_id` on the `Staff` table. All the data in the column will be lost.
  - You are about to drop the column `staff_id` on the `Staff` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[staffId]` on the table `Schedule` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[staffId]` on the table `Staff` will be added. If there are existing duplicate values, this will fail.
  - The required column `addressId` was added to the `Address` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `shiftId` to the `Schedule` table without a default value. This is not possible if the table is not empty.
  - Added the required column `staffId` to the `Schedule` table without a default value. This is not possible if the table is not empty.
  - Added the required column `endTime` to the `Shift` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shiftIame` to the `Shift` table without a default value. This is not possible if the table is not empty.
  - The required column `shiftId` was added to the `Shift` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `startTime` to the `Shift` table without a default value. This is not possible if the table is not empty.
  - Added the required column `firstName` to the `Staff` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `Staff` table without a default value. This is not possible if the table is not empty.
  - Added the required column `staffId` to the `Staff` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Schedule" DROP CONSTRAINT "Schedule_shift_id_fkey";

-- DropForeignKey
ALTER TABLE "Schedule" DROP CONSTRAINT "Schedule_staff_id_fkey";

-- DropForeignKey
ALTER TABLE "Staff" DROP CONSTRAINT "Staff_address_id_fkey";

-- DropForeignKey
ALTER TABLE "Staff" DROP CONSTRAINT "Staff_shift_id_fkey";

-- DropForeignKey
ALTER TABLE "Staff" DROP CONSTRAINT "Staff_staff_id_fkey";

-- DropIndex
DROP INDEX "Schedule_staff_id_key";

-- DropIndex
DROP INDEX "Staff_staff_id_key";

-- AlterTable
ALTER TABLE "Address" DROP CONSTRAINT "Address_pkey",
DROP COLUMN "address_id",
ADD COLUMN     "addressId" TEXT NOT NULL,
ADD CONSTRAINT "Address_pkey" PRIMARY KEY ("addressId");

-- AlterTable
ALTER TABLE "Schedule" DROP CONSTRAINT "Schedule_pkey",
DROP COLUMN "schedule_id",
DROP COLUMN "shift_id",
DROP COLUMN "staff_id",
ADD COLUMN     "scheduleId" SERIAL NOT NULL,
ADD COLUMN     "shiftId" TEXT NOT NULL,
ADD COLUMN     "staffId" TEXT NOT NULL,
ADD CONSTRAINT "Schedule_pkey" PRIMARY KEY ("scheduleId");

-- AlterTable
ALTER TABLE "Shift" DROP CONSTRAINT "Shift_pkey",
DROP COLUMN "end_time",
DROP COLUMN "shift_id",
DROP COLUMN "shift_name",
DROP COLUMN "start_time",
ADD COLUMN     "endTime" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "shiftIame" VARCHAR(50) NOT NULL,
ADD COLUMN     "shiftId" TEXT NOT NULL,
ADD COLUMN     "startTime" TIMESTAMP(3) NOT NULL,
ADD CONSTRAINT "Shift_pkey" PRIMARY KEY ("shiftId");

-- AlterTable
ALTER TABLE "Staff" DROP COLUMN "address_id",
DROP COLUMN "first_name",
DROP COLUMN "hire_date",
DROP COLUMN "last_name",
DROP COLUMN "shift_id",
DROP COLUMN "staff_id",
ADD COLUMN     "addressId" TEXT,
ADD COLUMN     "firstName" VARCHAR(50) NOT NULL,
ADD COLUMN     "hireDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "lastName" VARCHAR(50) NOT NULL,
ADD COLUMN     "shiftId" TEXT,
ADD COLUMN     "staffId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Schedule_staffId_key" ON "Schedule"("staffId");

-- CreateIndex
CREATE UNIQUE INDEX "Staff_staffId_key" ON "Staff"("staffId");

-- AddForeignKey
ALTER TABLE "Staff" ADD CONSTRAINT "Staff_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Staff" ADD CONSTRAINT "Staff_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address"("addressId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Staff" ADD CONSTRAINT "Staff_shiftId_fkey" FOREIGN KEY ("shiftId") REFERENCES "Shift"("shiftId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Schedule" ADD CONSTRAINT "Schedule_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "Staff"("staffId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Schedule" ADD CONSTRAINT "Schedule_shiftId_fkey" FOREIGN KEY ("shiftId") REFERENCES "Shift"("shiftId") ON DELETE RESTRICT ON UPDATE CASCADE;
