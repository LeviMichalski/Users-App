/*
  Warnings:

  - The primary key for the `user` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "user" DROP CONSTRAINT "user_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "user_pkey" PRIMARY KEY ("id");
