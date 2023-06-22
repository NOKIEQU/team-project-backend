/*
  Warnings:

  - Added the required column `expires` to the `Verification` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Verification` ADD COLUMN `expires` DATETIME(3) NOT NULL;
