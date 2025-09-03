-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "salt" TEXT,
ALTER COLUMN "publicKey" DROP NOT NULL;
