/*
  Warnings:

  - Added the required column `img_ktp` to the `Payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `img_sim` to the `Payment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "img_ktp" TEXT NOT NULL,
ADD COLUMN     "img_sim" TEXT NOT NULL;
