import { Inject, Injectable } from '@nestjs/common';
import { TOKENS } from 'src/core/application/constants/injection.tokens';
import { CategoryUseCases } from 'src/core/application/ports/input/categories/categories.use-case.port';
import { CreateCategoryDto } from 'src/drivers/aplication/dtos/categories/create-category.dto';
import { UpdateCategoryDto } from 'src/drivers/aplication/dtos/categories/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @Inject(TOKENS.CATEGORY_USE_CASES)
    private readonly categoryUseCase: CategoryUseCases,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    return await this.categoryUseCase.create(createCategoryDto);
  }

  async findAll() {
    return await this.categoryUseCase.findAll();
  }

  async findOne(id: number) {
    return await this.categoryUseCase.findById(id);
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return await this.categoryUseCase.update(id, updateCategoryDto);
  }

  async remove(id: number) {
    return await this.categoryUseCase.delete(id);
  }
}
