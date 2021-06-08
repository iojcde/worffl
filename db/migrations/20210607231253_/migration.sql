/*
  Warnings:

  - You are about to drop the column `ghrepoid` on the `GhRepo` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[ghid]` on the table `GhRepo` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `ghid` to the `GhRepo` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "GhRepo.ghrepoid_unique";

-- AlterTable
ALTER TABLE "GhRepo" DROP COLUMN "ghrepoid",
ADD COLUMN     "ghid" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "GhRepo.ghid_unique" ON "GhRepo"("ghid");
