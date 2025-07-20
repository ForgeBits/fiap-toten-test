-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_clientId_fkey";

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "codeClientRandom" INTEGER,
ADD COLUMN     "isRandomClient" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "clientId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE SET NULL ON UPDATE CASCADE;
