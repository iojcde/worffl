/*
  Warnings:

  - Added the required column `git` to the `Deployment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Deployment" ADD COLUMN     "git" TEXT NOT NULL;
