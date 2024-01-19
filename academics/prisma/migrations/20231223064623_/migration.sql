/*
  Warnings:

  - You are about to drop the column `priority` on the `assignments` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `assignments` table. All the data in the column will be lost.
  - Added the required column `endDate` to the `assignments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startDate` to the `assignments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `assignments` DROP COLUMN `priority`,
    DROP COLUMN `status`,
    ADD COLUMN `endDate` DATETIME(3) NOT NULL,
    ADD COLUMN `startDate` DATETIME(3) NOT NULL;
