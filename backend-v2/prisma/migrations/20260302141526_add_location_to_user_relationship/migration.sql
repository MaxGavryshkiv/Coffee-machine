/*
  Warnings:

  - You are about to drop the column `tenantId` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `tenantId` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `tenantId` on the `Purchase` table. All the data in the column will be lost.
  - You are about to drop the column `tenantId` on the `Stock` table. All the data in the column will be lost.
  - You are about to drop the column `tenantId` on the `StockMovement` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[locationId,ingredientId]` on the table `Stock` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `locationId` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `locationId` to the `Payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `locationId` to the `Purchase` table without a default value. This is not possible if the table is not empty.
  - Added the required column `locationId` to the `Stock` table without a default value. This is not possible if the table is not empty.
  - Added the required column `locationId` to the `StockMovement` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_tenantId_fkey";

-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_tenantId_fkey";

-- DropForeignKey
ALTER TABLE "Purchase" DROP CONSTRAINT "Purchase_tenantId_fkey";

-- DropForeignKey
ALTER TABLE "Stock" DROP CONSTRAINT "Stock_tenantId_fkey";

-- DropForeignKey
ALTER TABLE "StockMovement" DROP CONSTRAINT "StockMovement_tenantId_fkey";

-- DropIndex
DROP INDEX "Order_tenantId_idx";

-- DropIndex
DROP INDEX "Payment_tenantId_idx";

-- DropIndex
DROP INDEX "Purchase_tenantId_idx";

-- DropIndex
DROP INDEX "Stock_ingredientId_key";

-- DropIndex
DROP INDEX "Stock_tenantId_idx";

-- DropIndex
DROP INDEX "StockMovement_tenantId_idx";

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "tenantId",
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "locationId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "tenantId",
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "locationId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Purchase" DROP COLUMN "tenantId",
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "locationId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Recipe" ADD COLUMN     "productId" TEXT;

-- AlterTable
ALTER TABLE "Stock" DROP COLUMN "tenantId",
ADD COLUMN     "locationId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "StockMovement" DROP COLUMN "tenantId",
ADD COLUMN     "locationId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "locationId" TEXT;

-- CreateTable
CREATE TABLE "Location" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT,
    "tenantId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Location_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserLocation" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "locationId" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserLocation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Location_tenantId_deletedAt_idx" ON "Location"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Location_tenantId_name_key" ON "Location"("tenantId", "name");

-- CreateIndex
CREATE INDEX "UserLocation_locationId_idx" ON "UserLocation"("locationId");

-- CreateIndex
CREATE UNIQUE INDEX "UserLocation_userId_locationId_key" ON "UserLocation"("userId", "locationId");

-- CreateIndex
CREATE INDEX "Order_locationId_deletedAt_idx" ON "Order"("locationId", "deletedAt");

-- CreateIndex
CREATE INDEX "Payment_locationId_idx" ON "Payment"("locationId");

-- CreateIndex
CREATE INDEX "Purchase_locationId_deletedAt_idx" ON "Purchase"("locationId", "deletedAt");

-- CreateIndex
CREATE INDEX "Stock_locationId_idx" ON "Stock"("locationId");

-- CreateIndex
CREATE UNIQUE INDEX "Stock_locationId_ingredientId_key" ON "Stock"("locationId", "ingredientId");

-- CreateIndex
CREATE INDEX "StockMovement_locationId_idx" ON "StockMovement"("locationId");

-- AddForeignKey
ALTER TABLE "Location" ADD CONSTRAINT "Location_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserLocation" ADD CONSTRAINT "UserLocation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserLocation" ADD CONSTRAINT "UserLocation_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Stock" ADD CONSTRAINT "Stock_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockMovement" ADD CONSTRAINT "StockMovement_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Purchase" ADD CONSTRAINT "Purchase_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
