/*
  Warnings:

  - You are about to drop the column `user_id` on the `Booking` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_user_id_fkey";

-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "user_id";
