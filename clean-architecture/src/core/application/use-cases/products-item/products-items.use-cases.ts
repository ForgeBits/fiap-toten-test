import { Inject, Injectable } from '@nestjs/common';
import { ProductItemsUseCases } from '../../ports/input/product-item/product-items.use-case.port';
import { TOKENS } from '../../constants/injection.tokens';
import { ProductsItemRepositoryInterface } from '../../ports/output/repositories/products-item/products-item.repository.interface';
import {
  ProductsItemsInterface,
  ProductsItemsResponseInterface,
} from 'src/core/domain/dtos/products-item/products-items.dto';
import { UpdateProductItemDto } from 'src/drivers/aplication/dtos/product-items/update-product-item.dto';

@Injectable()
export class ProductItemsUseCasesImpl implements ProductItemsUseCases {
  constructor(
    @Inject(TOKENS.PRODUCTS_ITEM_REPOSITORY)
    private readonly productItemsRepository: ProductsItemRepositoryInterface,
  ) {}

  async registerItem(
    data: ProductsItemsInterface,
  ): Promise<ProductsItemsResponseInterface> {
    return await this.productItemsRepository.registerItem(data);
  }

  async getAllItems(): Promise<ProductsItemsResponseInterface[]> {
    return await this.productItemsRepository.getAllItems();
  }

  async updateItem(
    id: number,
    data: UpdateProductItemDto,
  ): Promise<ProductsItemsResponseInterface> {
    return await this.productItemsRepository.updateItem(id, data);
  }

  async deleteItem(id: number): Promise<any> {
    return await this.productItemsRepository.deleteItem(id);
  }
}
