/*
  Warnings:

  - You are about to drop the column `task` on the `Tasks` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[title,userId]` on the table `Tasks` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[todo,taskId]` on the table `Todo` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `title` to the `Tasks` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Tasks` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Todo` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Tasks_task_key";

-- DropIndex
DROP INDEX "Todo_todo_key";

-- AlterTable
ALTER TABLE "Tasks" DROP COLUMN "task",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "title" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Todo" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Tasks_title_userId_key" ON "Tasks"("title", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "Todo_todo_taskId_key" ON "Todo"("todo", "taskId");
