/*
  Warnings:

  - You are about to drop the column `duration` on the `Todo` table. All the data in the column will be lost.
  - You are about to drop the column `long_break` on the `Todo` table. All the data in the column will be lost.
  - You are about to drop the column `session_completed` on the `Todo` table. All the data in the column will be lost.
  - You are about to drop the column `session_target` on the `Todo` table. All the data in the column will be lost.
  - You are about to drop the column `short_break` on the `Todo` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Todo` table. All the data in the column will be lost.
  - You are about to drop the column `isVerified` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the `Focus_session` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Focus_session" DROP CONSTRAINT "Focus_session_todoId_fkey";

-- AlterTable
ALTER TABLE "Todo" DROP COLUMN "duration",
DROP COLUMN "long_break",
DROP COLUMN "session_completed",
DROP COLUMN "session_target",
DROP COLUMN "short_break",
DROP COLUMN "status",
ADD COLUMN     "is_completed" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Users" DROP COLUMN "isVerified";

-- DropTable
DROP TABLE "Focus_session";

-- DropEnum
DROP TYPE "Status_todo";

-- CreateTable
CREATE TABLE "Pomodoro" (
    "id" TEXT NOT NULL,
    "session" INTEGER NOT NULL,
    "duration_minutes" INTEGER NOT NULL,
    "break_time_minutes" INTEGER NOT NULL,
    "total_time" TIMESTAMP(3) NOT NULL,
    "is_completed" BOOLEAN NOT NULL DEFAULT false,
    "status" "Status_focus" NOT NULL,
    "todoId" TEXT NOT NULL,

    CONSTRAINT "Pomodoro_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Pomodoro_todoId_key" ON "Pomodoro"("todoId");

-- AddForeignKey
ALTER TABLE "Pomodoro" ADD CONSTRAINT "Pomodoro_todoId_fkey" FOREIGN KEY ("todoId") REFERENCES "Todo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
