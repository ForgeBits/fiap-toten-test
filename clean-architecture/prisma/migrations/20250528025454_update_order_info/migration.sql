-- AlterTable
ALTER TABLE "OrderCustomerItem" ADD COLUMN     "description" TEXT,
ADD COLUMN     "photo" TEXT,
ADD COLUMN     "title" TEXT,
ADD COLUMN     "unitPrice" DECIMAL(65,30);

-- AlterTable
ALTER TABLE "OrderItem" ADD COLUMN     "description" TEXT,
ADD COLUMN     "photo" TEXT,
ADD COLUMN     "title" TEXT,
ADD COLUMN     "unitPrice" DECIMAL(65,30);
