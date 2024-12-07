-- CreateEnum
CREATE TYPE "CarStatus" AS ENUM ('Available', 'Unavailable');

-- CreateTable
CREATE TABLE "Cars" (
    "car_id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "fuel" TEXT NOT NULL,
    "capacity" TEXT NOT NULL,
    "transimisi" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "color" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "status" "CarStatus" NOT NULL DEFAULT 'Available',

    CONSTRAINT "Cars_pkey" PRIMARY KEY ("car_id")
);

-- CreateTable
CREATE TABLE "User" (
    "user_id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "phone" INTEGER NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("user_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
