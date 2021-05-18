/*
  Warnings:

  - A unique constraint covering the columns `[ghrepoid]` on the table `GhRepo` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `ghrepoid` to the `GhRepo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "GhRepo" ADD COLUMN     "ghrepoid" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "GhRepo.ghrepoid_unique" ON "GhRepo"("ghrepoid");
