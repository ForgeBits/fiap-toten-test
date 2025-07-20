import { ProductsItemRepositoryInterface } from 'src/core/application/ports/output/repositories/products-item/products-item.repository.interface';
import {
  ProductsItemsResponseInterface,
  RegisterItemInterface,
} from 'src/core/domain/dtos/products-item/products-items.dto';
import { PrismaService } from 'src/infrastructure/config/database/prisma/prisma.service';
import { ProductsItemMapper } from '../../mappers/products-item/products-item.mappers';
import { Injectable } from '@nestjs/common';
import { UpdateProductItemDto } from 'src/drivers/aplication/dtos/product-items/update-product-item.dto';

@Injectable()
export class ProductItemsRepository implements ProductsItemRepositoryInterface {
  constructor(private readonly prismaService: PrismaService) {}

  async registerItem(
    data: RegisterItemInterface,
  ): Promise<ProductsItemsResponseInterface> {
    const newItem = await this.prismaService.item.create({
      data,
    });

    return ProductsItemMapper.mappedCollaboratorToDomain({
      ...newItem,
      amount: newItem.amount.toNumber(),
    });
  }

  async getAllItems(): Promise<ProductsItemsResponseInterface[]> {
    const items = await this.prismaService.item.findMany({
      where: { isActive: true },
    });

    return items.map((item) =>
      ProductsItemMapper.mappedCollaboratorToDomain({
        ...item,
        amount: item.amount.toNumber(),
      }),
    );
  }

  async updateItem(
    id: number,
    data: UpdateProductItemDto,
  ): Promise<ProductsItemsResponseInterface> {
    const updatedItem = await this.prismaService.item.update({
      where: { id },
      data,
    });

    return ProductsItemMapper.mappedCollaboratorToDomain({
      ...updatedItem,
      amount: updatedItem.amount.toNumber(),
    });
  }

  async deleteItem(id: number): Promise<ProductsItemsResponseInterface> {
    const deletedItem = await this.prismaService.item.update({
      where: { id },
      data: { isActive: false },
    });

    return ProductsItemMapper.mappedCollaboratorToDomain({
      ...deletedItem,
      amount: deletedItem.amount.toNumber(),
    });
  }
}
