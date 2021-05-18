/*
  Warnings:

  - Added the required column `private` to the `GhRepo` table without a default value. This is not possible if the table is not empty.
  - Made the column `ownerId` on table `GhRepo` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "GhRepo" ADD COLUMN     "private" BOOLEAN NOT NULL,
ALTER COLUMN "ownerId" SET NOT NULL;
