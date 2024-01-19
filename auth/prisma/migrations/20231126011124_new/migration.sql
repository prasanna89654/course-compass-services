-- AlterTable
ALTER TABLE `institutions` ADD COLUMN `userId` INTEGER NULL;

-- AlterTable
ALTER TABLE `study_levels` ADD COLUMN `userId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `study_levels` ADD CONSTRAINT `study_levels_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `institutions` ADD CONSTRAINT `institutions_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
