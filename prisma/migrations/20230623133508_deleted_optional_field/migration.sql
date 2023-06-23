/*
  Warnings:

  - Made the column `authorName` on table `BoostedOffers` required. This step will fail if there are existing NULL values in that column.
  - Made the column `sellType` on table `BoostedOffers` required. This step will fail if there are existing NULL values in that column.
  - Made the column `authorName` on table `MainBoostedOffers` required. This step will fail if there are existing NULL values in that column.
  - Made the column `sellType` on table `MainBoostedOffers` required. This step will fail if there are existing NULL values in that column.
  - Made the column `authorName` on table `Offers` required. This step will fail if there are existing NULL values in that column.
  - Made the column `sellType` on table `Offers` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `BoostedOffers` MODIFY `authorName` VARCHAR(191) NOT NULL,
    MODIFY `sellType` ENUM('RENT', 'BUY') NOT NULL;

-- AlterTable
ALTER TABLE `MainBoostedOffers` MODIFY `authorName` VARCHAR(191) NOT NULL,
    MODIFY `sellType` ENUM('RENT', 'BUY') NOT NULL;

-- AlterTable
ALTER TABLE `Offers` MODIFY `authorName` VARCHAR(191) NOT NULL,
    MODIFY `sellType` ENUM('RENT', 'BUY') NOT NULL;
