-- AlterTable
ALTER TABLE `BoostedOffers` ADD COLUMN `authorName` VARCHAR(191) NULL,
    ADD COLUMN `sellType` ENUM('RENT', 'BUY') NULL;

-- AlterTable
ALTER TABLE `MainBoostedOffers` ADD COLUMN `authorName` VARCHAR(191) NULL,
    ADD COLUMN `sellType` ENUM('RENT', 'BUY') NULL;

-- AlterTable
ALTER TABLE `Offers` ADD COLUMN `authorName` VARCHAR(191) NULL,
    ADD COLUMN `sellType` ENUM('RENT', 'BUY') NULL;
