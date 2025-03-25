/*
  Warnings:

  - You are about to drop the column `priorityId` on the `tickets` table. All the data in the column will be lost.
  - You are about to alter the column `deletedAt` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to drop the `priorities` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `tickets` DROP FOREIGN KEY `tickets_priorityId_fkey`;

-- DropIndex
DROP INDEX `tickets_priorityId_fkey` ON `tickets`;

-- AlterTable
ALTER TABLE `tickets` DROP COLUMN `priorityId`,
    ADD COLUMN `priority` ENUM('Low', 'Medium', 'High', 'Critical') NOT NULL DEFAULT 'Medium';

-- AlterTable
ALTER TABLE `users` MODIFY `deletedAt` TIMESTAMP NULL;

-- DropTable
DROP TABLE `priorities`;
