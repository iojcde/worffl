/*
  Warnings:

  - A unique constraint covering the columns `[containerId]` on the table `Deployment` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Deployment" ADD COLUMN     "containerId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Deployment.containerId_unique" ON "Deployment"("containerId");
