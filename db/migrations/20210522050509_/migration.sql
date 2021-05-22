/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Team` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `Team` table without a default value. This is not possible if the table is not empty.
  - Added the required column `installationId` to the `Team` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Team" ADD COLUMN     "name" TEXT NOT NULL,
DROP COLUMN "installationId",
ADD COLUMN     "installationId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Team.name_unique" ON "Team"("name");
