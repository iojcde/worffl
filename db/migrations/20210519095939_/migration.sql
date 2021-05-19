/*
  Warnings:

  - You are about to drop the column `git` on the `Project` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[projectId]` on the table `GhRepo` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "GhRepo" ADD COLUMN     "projectId" INTEGER;

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "git";

-- CreateIndex
CREATE UNIQUE INDEX "GhRepo_projectId_unique" ON "GhRepo"("projectId");

-- AddForeignKey
ALTER TABLE "GhRepo" ADD FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;
