-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `username` CHAR(20) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `listings` INTEGER NOT NULL DEFAULT 0,
    `bids` INTEGER NOT NULL DEFAULT 0,
    `banned` BOOLEAN NOT NULL DEFAULT false,
    `activated` BOOLEAN NOT NULL DEFAULT false,
    `role` ENUM('USER', 'ADMIN', 'PREMIUM') NOT NULL DEFAULT 'USER',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_id_key`(`id`),
    UNIQUE INDEX `User_username_key`(`username`),
    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RefreshToken` (
    `id` VARCHAR(191) NOT NULL,
    `hashedToken` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `revoked` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `RefreshToken_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Verification` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `code` INTEGER NOT NULL,
    `expires` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Verification_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Offers` (
    `id` VARCHAR(191) NOT NULL,
    `author` VARCHAR(191) NOT NULL,
    `title` CHAR(100) NOT NULL,
    `description` VARCHAR(2000) NOT NULL,
    `region` ENUM('DOLNOSLASKIE', 'KUJAWSKOPOMORSKIE', 'LUBELSKIE', 'LUBUSKIE', 'LODZKIE', 'MALOPOLSKIE', 'MAZOWIECKIE', 'OPOLSKIE', 'PODKARPACKIE', 'PODLASKIE', 'POMORSKIE', 'SLASKIE', 'SWIETOKRZYSKIE', 'WARMINSKOMAZURSKIE', 'WIELKOPOLSKIE', 'ZACHODNIOPOMORSKIE') NOT NULL,
    `type` ENUM('DOM', 'MIESZKANIE', 'DZIALKA', 'GARAZ', 'POKOJ', 'LOKAL', 'MAGAZYN') NOT NULL,
    `city` VARCHAR(191) NOT NULL,
    `isBoosted` BOOLEAN NOT NULL DEFAULT false,
    `properties` JSON NOT NULL,
    `expires` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Offers_id_key`(`id`),
    UNIQUE INDEX `Offers_title_key`(`title`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BoostedOffers` (
    `id` VARCHAR(191) NOT NULL,
    `author` VARCHAR(191) NOT NULL,
    `title` CHAR(100) NOT NULL,
    `description` VARCHAR(2000) NOT NULL,
    `region` ENUM('DOLNOSLASKIE', 'KUJAWSKOPOMORSKIE', 'LUBELSKIE', 'LUBUSKIE', 'LODZKIE', 'MALOPOLSKIE', 'MAZOWIECKIE', 'OPOLSKIE', 'PODKARPACKIE', 'PODLASKIE', 'POMORSKIE', 'SLASKIE', 'SWIETOKRZYSKIE', 'WARMINSKOMAZURSKIE', 'WIELKOPOLSKIE', 'ZACHODNIOPOMORSKIE') NOT NULL,
    `type` ENUM('DOM', 'MIESZKANIE', 'DZIALKA', 'GARAZ', 'POKOJ', 'LOKAL', 'MAGAZYN') NOT NULL,
    `city` VARCHAR(191) NOT NULL,
    `properties` JSON NOT NULL,
    `expires` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `BoostedOffers_id_key`(`id`),
    UNIQUE INDEX `BoostedOffers_title_key`(`title`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MainBoostedOffers` (
    `id` VARCHAR(191) NOT NULL,
    `author` VARCHAR(191) NOT NULL,
    `title` CHAR(100) NOT NULL,
    `description` VARCHAR(2000) NOT NULL,
    `region` ENUM('DOLNOSLASKIE', 'KUJAWSKOPOMORSKIE', 'LUBELSKIE', 'LUBUSKIE', 'LODZKIE', 'MALOPOLSKIE', 'MAZOWIECKIE', 'OPOLSKIE', 'PODKARPACKIE', 'PODLASKIE', 'POMORSKIE', 'SLASKIE', 'SWIETOKRZYSKIE', 'WARMINSKOMAZURSKIE', 'WIELKOPOLSKIE', 'ZACHODNIOPOMORSKIE') NOT NULL,
    `type` ENUM('DOM', 'MIESZKANIE', 'DZIALKA', 'GARAZ', 'POKOJ', 'LOKAL', 'MAGAZYN') NOT NULL,
    `city` VARCHAR(191) NOT NULL,
    `properties` JSON NOT NULL,
    `expires` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `MainBoostedOffers_id_key`(`id`),
    UNIQUE INDEX `MainBoostedOffers_title_key`(`title`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `RefreshToken` ADD CONSTRAINT `RefreshToken_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Verification` ADD CONSTRAINT `Verification_email_fkey` FOREIGN KEY (`email`) REFERENCES `User`(`email`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Offers` ADD CONSTRAINT `Offers_author_fkey` FOREIGN KEY (`author`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BoostedOffers` ADD CONSTRAINT `BoostedOffers_author_fkey` FOREIGN KEY (`author`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MainBoostedOffers` ADD CONSTRAINT `MainBoostedOffers_author_fkey` FOREIGN KEY (`author`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
