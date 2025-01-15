/*
  Warnings:

  - You are about to alter the column `content` on the `tags` table. The data in that column could be lost. The data in that column will be cast from `VarChar(100)` to `VarChar(10)`.

*/
-- AlterTable
ALTER TABLE `tags` MODIFY `content` VARCHAR(10) NOT NULL;
