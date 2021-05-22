/*
  Warnings:

  - Made the column `projectId` on table `GhRepo` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "GhRepo" ALTER COLUMN "projectId" SET NOT NULL;
