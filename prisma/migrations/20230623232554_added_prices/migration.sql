/*
  Warnings:

  - Added the required column `price` to the `BoostedOffers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `MainBoostedOffers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `Offers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `BoostedOffers` ADD COLUMN `price` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `MainBoostedOffers` ADD COLUMN `price` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `Offers` ADD COLUMN `price` INTEGER NOT NULL;
