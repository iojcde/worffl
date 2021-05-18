/*
  Warnings:

  - A unique constraint covering the columns `[ghuserid]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "ghuserid" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "User.ghuserid_unique" ON "User"("ghuserid");
