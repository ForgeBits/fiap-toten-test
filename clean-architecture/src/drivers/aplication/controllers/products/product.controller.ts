import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ProductService } from '../../../../infrastructure/modules/products/product.service';
import { CreateProductDto } from '../../dtos/products/create-product.dto';
import { UpdateProductDto } from '../../dtos/products/update-product.dto';
import { ProductsFiltersQueryDto } from '../../dtos/products/products.filters.query.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import { AuthenticationGuard } from '../../guards/authentication.guard';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @ApiOperation({ summary: 'Cria um novo produto' })
  @ApiBody({
    type: CreateProductDto,
    description: 'Dados para criação de um novo produto',
  })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AuthenticationGuard)
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lista todos os produtos com filtros opcionais' })
  @ApiResponse({
    status: 200,
    description: 'Lista de produtos retornada com sucesso',
  })
  @ApiResponse({
    status: 400,
    description: 'Parâmetros de filtro inválidos',
  })
  findAll(@Query() filters: ProductsFiltersQueryDto) {
    return this.productService.findAll(filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Busca um produto pelo ID' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID do produto a ser consultado',
    example: 42,
  })
  findOne(@Param('id') id: string) {
    return this.productService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualiza os dados de um produto pelo ID' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID do produto a ser atualizado',
    example: 42,
  })
  @ApiBody({
    type: UpdateProductDto,
    description: 'Dados a serem atualizados no produto',
  })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AuthenticationGuard)
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(+id, updateProductDto);
  }

  @ApiOperation({ summary: 'Remove um produto pelo ID' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID do produto a ser removido',
    example: 42,
  })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AuthenticationGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.remove(+id);
  }
}
