/*
  Warnings:

  - Changed the type of `content` on the `LogLine` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "LogLine" DROP COLUMN "content",
ADD COLUMN     "content" BYTEA NOT NULL;
