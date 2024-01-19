/*
  Warnings:

  - You are about to drop the column `endDate` on the `assignments` table. All the data in the column will be lost.
  - You are about to drop the column `priority` on the `assignments` table. All the data in the column will be lost.
  - You are about to drop the column `startDate` on the `assignments` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `assignments` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `assignments` DROP COLUMN `endDate`,
    DROP COLUMN `priority`,
    DROP COLUMN `startDate`,
    DROP COLUMN `status`;
