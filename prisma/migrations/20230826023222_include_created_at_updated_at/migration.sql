/*
  Warnings:

  - Added the required column `updatedAt` to the `medias` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `posts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `publications` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "medias" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "posts" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "publications" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
