/*
  Warnings:

  - The primary key for the `Address` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Shift` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Staff` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[staff_id]` on the table `Schedule` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[staff_id]` on the table `Staff` will be added. If there are existing duplicate values, this will fail.
  - The required column `id` was added to the `Staff` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE "Schedule" DROP CONSTRAINT "Schedule_shift_id_fkey";

-- DropForeignKey
ALTER TABLE "Schedule" DROP CONSTRAINT "Schedule_staff_id_fkey";

-- DropForeignKey
ALTER TABLE "Staff" DROP CONSTRAINT "Staff_address_id_fkey";

-- DropForeignKey
ALTER TABLE "Staff" DROP CONSTRAINT "Staff_shift_id_fkey";

-- AlterTable
ALTER TABLE "Address" DROP CONSTRAINT "Address_pkey",
ALTER COLUMN "address_id" DROP DEFAULT,
ALTER COLUMN "address_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Address_pkey" PRIMARY KEY ("address_id");
DROP SEQUENCE "Address_address_id_seq";

-- AlterTable
ALTER TABLE "Schedule" ALTER COLUMN "staff_id" SET DATA TYPE TEXT,
ALTER COLUMN "shift_id" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Shift" DROP CONSTRAINT "Shift_pkey",
ALTER COLUMN "shift_id" DROP DEFAULT,
ALTER COLUMN "shift_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Shift_pkey" PRIMARY KEY ("shift_id");
DROP SEQUENCE "Shift_shift_id_seq";

-- AlterTable
ALTER TABLE "Staff" DROP CONSTRAINT "Staff_pkey",
ADD COLUMN     "id" TEXT NOT NULL,
ALTER COLUMN "staff_id" DROP DEFAULT,
ALTER COLUMN "staff_id" SET DATA TYPE TEXT,
ALTER COLUMN "address_id" SET DATA TYPE TEXT,
ALTER COLUMN "shift_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Staff_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Staff_staff_id_seq";

-- CreateIndex
CREATE UNIQUE INDEX "Schedule_staff_id_key" ON "Schedule"("staff_id");

-- CreateIndex
CREATE UNIQUE INDEX "Staff_staff_id_key" ON "Staff"("staff_id");

-- AddForeignKey
ALTER TABLE "Staff" ADD CONSTRAINT "Staff_staff_id_fkey" FOREIGN KEY ("staff_id") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Staff" ADD CONSTRAINT "Staff_address_id_fkey" FOREIGN KEY ("address_id") REFERENCES "Address"("address_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Staff" ADD CONSTRAINT "Staff_shift_id_fkey" FOREIGN KEY ("shift_id") REFERENCES "Shift"("shift_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Schedule" ADD CONSTRAINT "Schedule_staff_id_fkey" FOREIGN KEY ("staff_id") REFERENCES "Staff"("staff_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Schedule" ADD CONSTRAINT "Schedule_shift_id_fkey" FOREIGN KEY ("shift_id") REFERENCES "Shift"("shift_id") ON DELETE RESTRICT ON UPDATE CASCADE;
