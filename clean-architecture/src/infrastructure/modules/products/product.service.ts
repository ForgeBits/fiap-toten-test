import { Inject, Injectable } from '@nestjs/common';
import { CreateProductDto } from '../../../drivers/aplication/dtos/products/create-product.dto';
import { UpdateProductDto } from '../../../drivers/aplication/dtos/products/update-product.dto';
import { ProductUseCases } from '../../../core/application/ports/input/products/products.use-case.port';
import { TOKENS } from '../../../core/application/constants/injection.tokens';
import { ProductsFiltersQueryDto } from 'src/drivers/aplication/dtos/products/products.filters.query.dto';

@Injectable()
export class ProductService {
  constructor(
    @Inject(TOKENS.PRODUCTS_USE_CASES)
    private readonly productUseCase: ProductUseCases,
  ) {}

  create(createProductDto: CreateProductDto) {
    return this.productUseCase.create(createProductDto);
  }

  findAll(filters: ProductsFiltersQueryDto) {
    return this.productUseCase.findAll(filters);
  }

  async findOne(id: number) {
    return await this.productUseCase.findById(id);
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    return await this.productUseCase.update(id, updateProductDto);
  }

  async remove(id: number) {
    return await this.productUseCase.delete(id);
  }
}
