/*
  Warnings:

  - You are about to drop the column `userId` on the `institutions` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `study_levels` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `institutions` DROP FOREIGN KEY `institutions_userId_fkey`;

-- DropForeignKey
ALTER TABLE `study_levels` DROP FOREIGN KEY `study_levels_userId_fkey`;

-- AlterTable
ALTER TABLE `institutions` DROP COLUMN `userId`;

-- AlterTable
ALTER TABLE `study_levels` DROP COLUMN `userId`;

-- CreateTable
CREATE TABLE `user_details` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `studyLevelId` INTEGER NULL,
    `institutionId` INTEGER NULL,
    `academicsType` ENUM('semester', 'year') NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `user_details` ADD CONSTRAINT `user_details_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_details` ADD CONSTRAINT `user_details_studyLevelId_fkey` FOREIGN KEY (`studyLevelId`) REFERENCES `study_levels`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_details` ADD CONSTRAINT `user_details_institutionId_fkey` FOREIGN KEY (`institutionId`) REFERENCES `institutions`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
