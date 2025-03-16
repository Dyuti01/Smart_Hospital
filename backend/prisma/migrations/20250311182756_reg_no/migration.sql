/*
  Warnings:

  - You are about to drop the column `registration` on the `Doctor` table. All the data in the column will be lost.
  - Added the required column `registrationNumber` to the `Doctor` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Doctor" DROP COLUMN "registration",
ADD COLUMN     "registrationNumber" TEXT NOT NULL;
