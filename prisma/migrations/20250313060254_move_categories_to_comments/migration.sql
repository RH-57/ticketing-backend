/*
  Warnings:

  - You are about to drop the column `categoryId` on the `tickets` table. All the data in the column will be lost.
  - You are about to drop the column `subCategoryId` on the `tickets` table. All the data in the column will be lost.
  - You are about to drop the column `subSubCategoryId` on the `tickets` table. All the data in the column will be lost.
  - You are about to alter the column `deletedAt` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - Added the required column `categoryId` to the `comments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subCategoryId` to the `comments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subSubCategoryId` to the `comments` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `tickets` DROP FOREIGN KEY `tickets_categoryId_fkey`;

-- DropForeignKey
ALTER TABLE `tickets` DROP FOREIGN KEY `tickets_subCategoryId_fkey`;

-- DropForeignKey
ALTER TABLE `tickets` DROP FOREIGN KEY `tickets_subSubCategoryId_fkey`;

-- DropIndex
DROP INDEX `tickets_categoryId_fkey` ON `tickets`;

-- DropIndex
DROP INDEX `tickets_subCategoryId_fkey` ON `tickets`;

-- DropIndex
DROP INDEX `tickets_subSubCategoryId_fkey` ON `tickets`;

-- AlterTable
ALTER TABLE `comments` ADD COLUMN `categoryId` INTEGER NOT NULL,
    ADD COLUMN `subCategoryId` INTEGER NOT NULL,
    ADD COLUMN `subSubCategoryId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `tickets` DROP COLUMN `categoryId`,
    DROP COLUMN `subCategoryId`,
    DROP COLUMN `subSubCategoryId`;

-- AlterTable
ALTER TABLE `users` MODIFY `deletedAt` TIMESTAMP NULL;

-- AddForeignKey
ALTER TABLE `comments` ADD CONSTRAINT `comments_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `categories`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `comments` ADD CONSTRAINT `comments_subCategoryId_fkey` FOREIGN KEY (`subCategoryId`) REFERENCES `sub_categories`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `comments` ADD CONSTRAINT `comments_subSubCategoryId_fkey` FOREIGN KEY (`subSubCategoryId`) REFERENCES `sub_sub_categories`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
