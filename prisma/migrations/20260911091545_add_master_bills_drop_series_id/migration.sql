/*
  Warnings:

  - You are about to drop the column `seriesId` on the `Entry` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Entry_seriesId_idx";

-- AlterTable
ALTER TABLE "Entry" DROP COLUMN "seriesId";

-- CreateTable
CREATE TABLE "MasterBill" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "categoryId" TEXT,
    "accountId" TEXT,
    "notes" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MasterBill_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MasterBill_userId_idx" ON "MasterBill"("userId");

-- AddForeignKey
ALTER TABLE "MasterBill" ADD CONSTRAINT "MasterBill_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MasterBill" ADD CONSTRAINT "MasterBill_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MasterBill" ADD CONSTRAINT "MasterBill_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE SET NULL ON UPDATE CASCADE;
