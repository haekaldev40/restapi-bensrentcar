/*
  Warnings:

  - Added the required column `destinations_id` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `duration` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status_pelunasan` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total_dp` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total_price` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total_kekurangan` to the `Payment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "destinations_id" INTEGER NOT NULL,
ADD COLUMN     "duration" INTEGER NOT NULL,
ADD COLUMN     "status_pelunasan" TEXT NOT NULL,
ADD COLUMN     "total_dp" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "total_price" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "total_kekurangan" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Destinations" (
    "destinations_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "price" INTEGER NOT NULL,

    CONSTRAINT "Destinations_pkey" PRIMARY KEY ("destinations_id")
);

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_destinations_id_fkey" FOREIGN KEY ("destinations_id") REFERENCES "Destinations"("destinations_id") ON DELETE RESTRICT ON UPDATE CASCADE;
