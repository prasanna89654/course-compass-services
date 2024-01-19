/*
  Warnings:

  - You are about to drop the column `title` on the `assignments` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `courses` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `notes` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `sub_assignments` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `assignments` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `courses` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `assignments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `courses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `notes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `sub_assignments` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `assignments_title_key` ON `assignments`;

-- DropIndex
DROP INDEX `courses_title_key` ON `courses`;

-- AlterTable
ALTER TABLE `assignments` DROP COLUMN `title`,
    ADD COLUMN `name` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `courses` DROP COLUMN `title`,
    ADD COLUMN `name` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `notes` DROP COLUMN `title`,
    ADD COLUMN `name` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `sub_assignments` DROP COLUMN `title`,
    ADD COLUMN `name` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `assignments_name_key` ON `assignments`(`name`);

-- CreateIndex
CREATE UNIQUE INDEX `courses_name_key` ON `courses`(`name`);
