/*
  Warnings:

  - You are about to drop the column `Semester` on the `courses` table. All the data in the column will be lost.
  - You are about to drop the column `Year` on the `courses` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `assignment_remarks` DROP FOREIGN KEY `assignment_remarks_assignmentId_fkey`;

-- DropForeignKey
ALTER TABLE `assignments` DROP FOREIGN KEY `assignments_courseId_fkey`;

-- DropForeignKey
ALTER TABLE `sub_assignment_remarks` DROP FOREIGN KEY `sub_assignment_remarks_subAssignmentId_fkey`;

-- DropForeignKey
ALTER TABLE `sub_assignments` DROP FOREIGN KEY `sub_assignments_assignmentId_fkey`;

-- AlterTable
ALTER TABLE `courses` DROP COLUMN `Semester`,
    DROP COLUMN `Year`,
    ADD COLUMN `semester` ENUM('first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth', 'tenth') NULL,
    ADD COLUMN `year` ENUM('first', 'second', 'third', 'fourth', 'fifth') NULL;

-- AddForeignKey
ALTER TABLE `assignments` ADD CONSTRAINT `assignments_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `courses`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `assignment_remarks` ADD CONSTRAINT `assignment_remarks_assignmentId_fkey` FOREIGN KEY (`assignmentId`) REFERENCES `assignments`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sub_assignments` ADD CONSTRAINT `sub_assignments_assignmentId_fkey` FOREIGN KEY (`assignmentId`) REFERENCES `assignments`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sub_assignment_remarks` ADD CONSTRAINT `sub_assignment_remarks_subAssignmentId_fkey` FOREIGN KEY (`subAssignmentId`) REFERENCES `sub_assignments`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
