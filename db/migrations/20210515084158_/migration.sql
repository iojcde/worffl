/*
  Warnings:

  - You are about to drop the column `userId` on the `Deployment` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Deployment" DROP CONSTRAINT "Deployment_userId_fkey";

-- AlterTable
ALTER TABLE "Deployment" DROP COLUMN "userId";
