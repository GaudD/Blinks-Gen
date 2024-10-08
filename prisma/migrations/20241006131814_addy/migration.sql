/*
  Warnings:

  - Added the required column `addy` to the `DonationEntry` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DonationEntry" ADD COLUMN     "addy" TEXT NOT NULL;
