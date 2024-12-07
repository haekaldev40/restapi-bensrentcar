/*
  Warnings:

  - Added the required column `no_plat` to the `Cars` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Cars" ADD COLUMN     "no_plat" TEXT NOT NULL;
