/*
  Warnings:

  - You are about to alter the column `deletedAt` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.

*/
-- AlterTable
ALTER TABLE `priorities` ALTER COLUMN `createdAt` DROP DEFAULT;

-- AlterTable
ALTER TABLE `users` MODIFY `deletedAt` TIMESTAMP NULL;
