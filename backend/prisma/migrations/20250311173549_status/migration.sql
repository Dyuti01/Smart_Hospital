/*
  Warnings:

  - You are about to drop the column `status` on the `Availability` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Availability" DROP COLUMN "status";

-- AlterTable
ALTER TABLE "Doctor" ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'Active';

-- AlterTable
ALTER TABLE "Staff" ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'Active';
