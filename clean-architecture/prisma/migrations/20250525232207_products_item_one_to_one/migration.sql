/*
  Warnings:

  - You are about to drop the `_ItemToProductItem` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_ItemToProductItem" DROP CONSTRAINT "_ItemToProductItem_A_fkey";

-- DropForeignKey
ALTER TABLE "_ItemToProductItem" DROP CONSTRAINT "_ItemToProductItem_B_fkey";

-- DropTable
DROP TABLE "_ItemToProductItem";

-- AddForeignKey
ALTER TABLE "ProductItem" ADD CONSTRAINT "ProductItem_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
