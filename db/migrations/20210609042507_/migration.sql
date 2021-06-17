/*
  Warnings:

  - The values [STAGING] on the enum `DeploymentType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "DeploymentType_new" AS ENUM ('PRODUCTION', 'PREVIEW');
ALTER TABLE "Deployment" ALTER COLUMN "type" TYPE "DeploymentType_new" USING ("type"::text::"DeploymentType_new");
ALTER TYPE "DeploymentType" RENAME TO "DeploymentType_old";
ALTER TYPE "DeploymentType_new" RENAME TO "DeploymentType";
DROP TYPE "DeploymentType_old";
COMMIT;
