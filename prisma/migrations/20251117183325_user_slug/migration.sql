/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `user` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "user" ADD COLUMN     "slug" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "user_slug_key" ON "user"("slug");
