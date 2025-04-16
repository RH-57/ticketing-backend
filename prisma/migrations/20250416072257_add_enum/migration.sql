/*
  Warnings:

  - You are about to alter the column `deletedAt` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.

*/
-- AlterTable
ALTER TABLE `comments` MODIFY `type` ENUM('Malfunction', 'Human_Error', 'Install', 'Other') NOT NULL DEFAULT 'Malfunction';

-- AlterTable
ALTER TABLE `tickets` MODIFY `status` ENUM('Open', 'In_Progress', 'Pending', 'Resolved', 'Closed') NOT NULL DEFAULT 'Open';

-- AlterTable
ALTER TABLE `users` MODIFY `role` ENUM('superadmin', 'admin', 'technician', 'viewer') NOT NULL DEFAULT 'admin',
    MODIFY `deletedAt` TIMESTAMP NULL;
