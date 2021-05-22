/*
  Warnings:

  - You are about to drop the column `git` on the `Deployment` table. All the data in the column will be lost.
  - You are about to drop the column `hash` on the `Deployment` table. All the data in the column will be lost.
  - You are about to drop the column `lang` on the `Deployment` table. All the data in the column will be lost.
  - You are about to drop the column `hashedPassword` on the `User` table. All the data in the column will be lost.
  - Added the required column `sha` to the `Deployment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lang` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mainBranch` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Deployment" DROP COLUMN "git",
DROP COLUMN "hash",
DROP COLUMN "lang",
ADD COLUMN     "logs" TEXT[],
ADD COLUMN     "sha" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "lang" TEXT NOT NULL,
ADD COLUMN     "mainBranch" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "hashedPassword",
ADD COLUMN     "installationId" TEXT;
