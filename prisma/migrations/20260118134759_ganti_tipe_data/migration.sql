/*
  Warnings:

  - The `duration` column on the `Todo` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `short_break` column on the `Todo` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `long_break` column on the `Todo` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Todo" DROP COLUMN "duration",
ADD COLUMN     "duration" INTEGER NOT NULL DEFAULT 25,
DROP COLUMN "short_break",
ADD COLUMN     "short_break" INTEGER NOT NULL DEFAULT 5,
DROP COLUMN "long_break",
ADD COLUMN     "long_break" INTEGER NOT NULL DEFAULT 15;
