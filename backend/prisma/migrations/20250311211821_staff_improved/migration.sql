/*
  Warnings:

  - You are about to drop the column `email` on the `Staff` table. All the data in the column will be lost.
  - You are about to drop the column `firstName` on the `Staff` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `Staff` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `Staff` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `Staff` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Staff_email_key";

-- AlterTable
ALTER TABLE "Staff" DROP COLUMN "email",
DROP COLUMN "firstName",
DROP COLUMN "lastName",
DROP COLUMN "phone",
DROP COLUMN "role";
