-- DropForeignKey
ALTER TABLE `offers` DROP FOREIGN KEY `Offers_categoryId_fkey`;

-- AlterTable
ALTER TABLE `offers` ADD COLUMN `rating` DOUBLE NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE `Reviews` (
    `id` VARCHAR(191) NOT NULL,
    `rating` DOUBLE NOT NULL,
    `comment` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `offerId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Reviews_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Offers` ADD CONSTRAINT `Offers_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Categories`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Reviews` ADD CONSTRAINT `Reviews_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Reviews` ADD CONSTRAINT `Reviews_offerId_fkey` FOREIGN KEY (`offerId`) REFERENCES `Offers`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
