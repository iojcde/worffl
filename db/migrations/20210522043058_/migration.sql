/*
  Warnings:

  - The `role` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[ownerTeamId]` on the table `GhRepo` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[ghOrgId]` on the table `Team` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `ownerTeamId` to the `GhRepo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ownerType` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `teamId` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ghOrgId` to the `Team` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "role" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "OwnerType" AS ENUM ('USER', 'TEAM');

-- AlterTable
ALTER TABLE "GhRepo" ADD COLUMN     "ownerTeamId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "ownerType" "OwnerType" NOT NULL,
ADD COLUMN     "teamId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Team" ADD COLUMN     "ghOrgId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "role",
ADD COLUMN     "role" "role" NOT NULL DEFAULT E'USER';

-- CreateIndex
CREATE UNIQUE INDEX "GhRepo.ownerTeamId_unique" ON "GhRepo"("ownerTeamId");

-- CreateIndex
CREATE UNIQUE INDEX "Team.ghOrgId_unique" ON "Team"("ghOrgId");

-- AddForeignKey
ALTER TABLE "Project" ADD FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GhRepo" ADD FOREIGN KEY ("ownerTeamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;
