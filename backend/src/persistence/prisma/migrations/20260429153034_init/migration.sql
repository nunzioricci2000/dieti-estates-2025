-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'ADMIN', 'AGENT');

-- CreateEnum
CREATE TYPE "AdvertisementType" AS ENUM ('SALE', 'RENT');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Advertisement" (
    "id" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "description" TEXT NOT NULL,
    "dimensions" INTEGER NOT NULL,
    "numberOfRooms" INTEGER NOT NULL,
    "energyClass" TEXT NOT NULL,
    "available" BOOLEAN NOT NULL DEFAULT true,
    "price" INTEGER NOT NULL,
    "images" TEXT NOT NULL,
    "additionalServices" TEXT NOT NULL,
    "nearbyPOIs" TEXT NOT NULL,
    "views" INTEGER NOT NULL DEFAULT 0,
    "visits" INTEGER NOT NULL DEFAULT 0,
    "offers" INTEGER NOT NULL DEFAULT 0,
    "type" "AdvertisementType" NOT NULL,
    "authorId" TEXT NOT NULL,

    CONSTRAINT "Advertisement_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Advertisement" ADD CONSTRAINT "Advertisement_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
