/*
  Warnings:

  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `email` on the `User` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(100)`.
  - Added the required column `imageMax` to the `User` table without a default value. This is not possible if the table is not empty.
  - Made the column `name` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `User` DROP PRIMARY KEY,
    ADD COLUMN `createdAt` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    ADD COLUMN `enableNotification` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `imageMax` INTEGER NOT NULL,
    ADD COLUMN `isLocalGalleryAccesible` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `status` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `updatedAt` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    MODIFY `id` BIGINT NOT NULL AUTO_INCREMENT,
    MODIFY `email` VARCHAR(100) NOT NULL,
    MODIFY `name` VARCHAR(30) NOT NULL,
    ADD PRIMARY KEY (`id`);
