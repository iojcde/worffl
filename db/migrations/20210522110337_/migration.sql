-- DropIndex
DROP INDEX "GhRepo.ownerTeamId_unique";

-- AlterTable
ALTER TABLE "GhRepo" ALTER COLUMN "createdAt" DROP DEFAULT;
