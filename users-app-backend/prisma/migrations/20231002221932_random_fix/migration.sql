-- DropIndex
DROP INDEX "user_email_key";

-- DropIndex
DROP INDEX "user_username_key";

-- AlterTable
ALTER TABLE "user" ADD CONSTRAINT "user_pkey" PRIMARY KEY ("username");
