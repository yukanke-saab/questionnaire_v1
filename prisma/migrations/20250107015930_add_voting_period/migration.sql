-- AlterTable
ALTER TABLE "Survey" ADD COLUMN     "votingEnd" TIMESTAMP(3) NOT NULL DEFAULT NOW() + interval '1 day';
