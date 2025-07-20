import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infrastructure/config/database/prisma/prisma.service';
import { ProductsRepositoryInterface } from 'src/core/application/ports/output/repositories/products/products.repository.interface';
import { Product } from 'src/core/domain/entities/products/product.entity';
import {
  ProductCreateInterface,
  ProductsQueryFiltersInterface,
} from 'src/core/domain/dtos/products/products.db.interface';
import { ProductMapper } from '../../mappers/products/products.mappers';
import {
  PaginatedResponse,
  PaginationMapper,
} from '../../mappers/common/pagination.mappers';

@Injectable()
export class ProductsRepository implements ProductsRepositoryInterface {
  constructor(private readonly prismaService: PrismaService) {}

  async create(product: ProductCreateInterface): Promise<Product> {
    return await this.prismaService.$transaction(async (prisma) => {
      //criar produtos
      const createdProduct = await prisma.product.create({
        data: {
          name: product.name,
          description: product.description ?? '',
          amount: product.amount,
          url_img: product.url_img,
          customizable: product.customizable,
          available: product.available,
          category: {
            connect: { id: product.category },
          },
        },
        include: {
          category: true,
        },
      });

      if (product?.productItems?.length) {
        //criar productItems
        const productItemsData = product?.productItems?.map((productItem) => ({
          essential: productItem.essential,
          quantity: productItem.quantity,
          customizable: productItem.customizable,
          product_id: createdProduct.id,
          item_id: productItem.id,
        }));

        await prisma.productItem.createMany({
          data: productItemsData,
        });
      }

      return ProductMapper.mappedProductToDomain(createdProduct);
    });
  }

  async findAll({
    page: filterPage,
    limit: filtersLimit,
    name,
    order,
    orderBy,
    categoryId,
  }: ProductsQueryFiltersInterface): Promise<PaginatedResponse<Product>> {
    const page = filterPage ?? 1;
    const limit = filtersLimit ?? 10;

    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      this.prismaService.product.findMany({
        skip,
        take: limit,
        orderBy: { [orderBy as string]: order },
        where: {
          ...(name && { name: { contains: name, mode: 'insensitive' } }),
          ...(categoryId && { category_id: Number(categoryId) }),
        },
        include: {
          category: true,
        },
      }),
      this.prismaService.product.count({
        where: {
          ...(name && { name: { contains: name, mode: 'insensitive' } }),
          ...(categoryId && { category_id: Number(categoryId) }),
        },
      }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return PaginationMapper.mappedPaginationResults({
      data: products.map((product) =>
        ProductMapper.mappedProductToDomain(product),
      ),
      meta: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  }

  async findById(id: number): Promise<Product | null> {
    const product = await this.prismaService.product.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });

    if (!product) {
      return null;
    }

    return ProductMapper.mappedProductToDomain(product);
  }

  async update(
    id: number,
    product: Partial<ProductCreateInterface>,
  ): Promise<Product> {
    const updatedProduct = await this.prismaService.product.update({
      where: { id },
      data: {
        ...product,
        description: product.description ?? '',
        category: product.category
          ? { connect: { id: product.category } }
          : undefined,
      },
      include: {
        category: true,
      },
    });
    return ProductMapper.mappedProductToDomain(updatedProduct);
  }

  async delete(id: number): Promise<void> {
    await this.prismaService.product.delete({
      where: { id },
    });
  }

  async findByName(name: string): Promise<Product | null> {
    const product = await this.prismaService.product.findFirst({
      where: { name },
      include: {
        category: true,
      },
    });

    if (!product) {
      return null;
    }

    return ProductMapper.mappedProductToDomain(product);
  }

  async findProductsByIds(ids: number[]): Promise<Product[]> {
    const products = await this.prismaService.product.findMany({
      where: { id: { in: ids } },
      include: {
        category: true,
      },
    });

    return products.map((product) =>
      ProductMapper.mappedProductToDomain(product),
    );
  }
}
