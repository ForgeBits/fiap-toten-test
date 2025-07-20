import { Inject, Injectable } from '@nestjs/common';
import { TOKENS } from 'src/core/application/constants/injection.tokens';
import { ProductItemsUseCases } from 'src/core/application/ports/input/product-item/product-items.use-case.port';
import { RegisterItemDto } from 'src/drivers/aplication/dtos/product-items/register-item.dto';
import { UpdateProductItemDto } from 'src/drivers/aplication/dtos/product-items/update-product-item.dto';

@Injectable()
export class ProductItemsService {
  constructor(
    @Inject(TOKENS.PRODUCT_ITEM_USE_CASES)
    private readonly productItemUseCases: ProductItemsUseCases,
  ) {}
  registerItem(registerItemDto: RegisterItemDto) {
    return this.productItemUseCases.registerItem(registerItemDto);
  }

  getAllItems() {
    return this.productItemUseCases.getAllItems();
  }

  updateItem(id: string, updateItemDto: UpdateProductItemDto) {
    const itemId = Number(id);
    return this.productItemUseCases.updateItem(itemId, updateItemDto);
  }

  deleteItem(id: string) {
    const itemId = Number(id);
    return this.productItemUseCases.deleteItem(itemId);
  }
}
