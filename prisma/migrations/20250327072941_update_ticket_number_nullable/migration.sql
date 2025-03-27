/*
  Warnings:

  - You are about to alter the column `deletedAt` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.

*/
-- AlterTable
ALTER TABLE `tickets` MODIFY `ticketNumber` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `users` MODIFY `deletedAt` TIMESTAMP NULL;
