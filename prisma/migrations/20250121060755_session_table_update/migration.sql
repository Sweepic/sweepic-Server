/*
  Warnings:

  - You are about to drop the column `user_id` on the `session` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[sid]` on the table `session` will be added. If there are existing duplicate values, this will fail.
  - Made the column `expires_at` on table `session` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `session` DROP FOREIGN KEY `session_user_id_fkey`;

-- DropIndex
DROP INDEX `session_user_id_fkey` ON `session`;

-- AlterTable
ALTER TABLE `session` DROP COLUMN `user_id`,
    MODIFY `expires_at` TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `session_sid_key` ON `session`(`sid`);
