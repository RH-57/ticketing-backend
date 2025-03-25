/*
  Warnings:

  - You are about to alter the column `deletedAt` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - Added the required column `branchId` to the `departments` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `departments_name_key` ON `departments`;

-- AlterTable
ALTER TABLE `departments` ADD COLUMN `branchId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `users` MODIFY `deletedAt` TIMESTAMP NULL;

-- AddForeignKey
ALTER TABLE `departments` ADD CONSTRAINT `departments_branchId_fkey` FOREIGN KEY (`branchId`) REFERENCES `branches`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
