/*
  Warnings:

  - You are about to drop the column `createdAt` on the `assignments` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `assignments` table. All the data in the column will be lost.
  - You are about to drop the column `endDate` on the `assignments` table. All the data in the column will be lost.
  - You are about to drop the column `file_path` on the `assignments` table. All the data in the column will be lost.
  - You are about to drop the column `link` on the `assignments` table. All the data in the column will be lost.
  - You are about to drop the column `priority` on the `assignments` table. All the data in the column will be lost.
  - You are about to drop the column `startDate` on the `assignments` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `assignments` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `assignments` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `assignments` DROP COLUMN `createdAt`,
    DROP COLUMN `description`,
    DROP COLUMN `endDate`,
    DROP COLUMN `file_path`,
    DROP COLUMN `link`,
    DROP COLUMN `priority`,
    DROP COLUMN `startDate`,
    DROP COLUMN `status`,
    DROP COLUMN `updatedAt`;
