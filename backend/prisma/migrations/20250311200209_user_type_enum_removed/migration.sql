/*
  Warnings:

  - The `userType` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "userType",
ADD COLUMN     "userType" TEXT;

-- DropEnum
DROP TYPE "UserType";
