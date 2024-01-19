/*
  Warnings:

  - Added the required column `endDate` to the `assignments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `priority` to the `assignments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startDate` to the `assignments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `assignments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `assignments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `assignments` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `description` VARCHAR(191) NULL,
    ADD COLUMN `endDate` DATETIME(3) NOT NULL,
    ADD COLUMN `file_path` VARCHAR(191) NULL,
    ADD COLUMN `link` VARCHAR(191) NULL,
    ADD COLUMN `priority` ENUM('low', 'medium', 'high') NOT NULL,
    ADD COLUMN `startDate` DATETIME(3) NOT NULL,
    ADD COLUMN `status` ENUM('todo', 'in_progress', 'review', 'complete') NOT NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;
