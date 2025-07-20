import { Injectable } from '@nestjs/common';
import { CategoriesMapper } from 'src/infrastructure/adapters/persistence/mappers/categories/categories.mappers';
import { PrismaService } from 'src/infrastructure/config/database/prisma/prisma.service';
import { CategoriesRepositoryInterface } from 'src/core/application/ports/output/repositories/categories/categories.repository.interface';
import {
  CategoriesInterface,
  CategoryCreateInterface,
} from 'src/core/domain/dtos/categories/categories.db.interface';

@Injectable()
export class CategoriesRepository implements CategoriesRepositoryInterface {
  constructor(private readonly prismaService: PrismaService) {}

  async create(
    category: CategoryCreateInterface,
  ): Promise<CategoriesInterface> {
    const createdCategory = await this.prismaService.categories.create({
      data: category,
    });

    return CategoriesMapper.mappedCategoryToDomain(createdCategory);
  }

  async findAll(): Promise<CategoriesInterface[]> {
    const categories = await this.prismaService.categories.findMany();
    return categories.map((category) =>
      CategoriesMapper.mappedCategoryToDomain(category),
    );
  }

  async findById(id: number): Promise<CategoriesInterface | null> {
    const category = await this.prismaService.categories.findUnique({
      where: { id },
    });

    if (!category) {
      return null;
    }

    return CategoriesMapper.mappedCategoryToDomain(category);
  }

  async update(
    id: number,
    category: Partial<CategoryCreateInterface>,
  ): Promise<CategoriesInterface> {
    const updatedCategory = await this.prismaService.categories.update({
      where: { id },
      data: category,
    });
    return CategoriesMapper.mappedCategoryToDomain(updatedCategory);
  }

  async delete(id: number): Promise<void> {
    await this.prismaService.categories.delete({
      where: { id },
    });
  }

  async findByName(name: string): Promise<CategoriesInterface | null> {
    const category = await this.prismaService.categories.findUnique({
      where: { name },
    });

    if (!category) {
      return null;
    }

    return CategoriesMapper.mappedCategoryToDomain(category);
  }
}
