/*
  Warnings:

  - You are about to drop the column `sub_active` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `sub_expires` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `User` DROP COLUMN `sub_active`,
    DROP COLUMN `sub_expires`;
