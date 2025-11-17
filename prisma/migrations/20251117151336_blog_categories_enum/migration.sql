/*
  Warnings:

  - You are about to drop the column `excerpt` on the `blog` table. All the data in the column will be lost.
  - Added the required column `description` to the `blog` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `category` on the `blog` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "BlogCategory" AS ENUM ('Company', 'Product', 'Tutorial', 'Engineering', 'Opinion', 'Research', 'Launch', 'Culture', 'Marketing', 'Event', 'FAQ', 'Storytelling', 'Policy', 'Playground');

-- AlterTable
ALTER TABLE "blog" DROP COLUMN "excerpt",
ADD COLUMN     "description" TEXT NOT NULL,
DROP COLUMN "category",
ADD COLUMN     "category" "BlogCategory" NOT NULL;
