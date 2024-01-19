/*
  Warnings:

  - Added the required column `priority` to the `assignments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `assignments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `assignments` ADD COLUMN `priority` ENUM('low', 'medium', 'high') NOT NULL,
    ADD COLUMN `status` ENUM('todo', 'in_progress', 'review', 'complete') NOT NULL;
