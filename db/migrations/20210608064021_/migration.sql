/*
  Warnings:

  - You are about to drop the column `containerId` on the `Deployment` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[containerUrl]` on the table `Deployment` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Deployment.containerId_unique";

-- AlterTable
ALTER TABLE "Deployment" DROP COLUMN "containerId",
ADD COLUMN     "containerUrl" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Deployment.containerUrl_unique" ON "Deployment"("containerUrl");
