/*
  Warnings:

  - You are about to drop the column `destinations_id` on the `Booking` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_destinations_id_fkey";

-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "destinations_id";
