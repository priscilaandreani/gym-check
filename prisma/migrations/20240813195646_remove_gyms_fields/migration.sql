/*
  Warnings:

  - You are about to drop the column `address` on the `gyms` table. All the data in the column will be lost.
  - You are about to drop the column `city` on the `gyms` table. All the data in the column will be lost.
  - You are about to drop the column `state` on the `gyms` table. All the data in the column will be lost.
  - You are about to drop the column `zip` on the `gyms` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "gyms" DROP COLUMN "address",
DROP COLUMN "city",
DROP COLUMN "state",
DROP COLUMN "zip";
