import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CreateCategoryDto } from '../../dtos/categories/create-category.dto';
import { UpdateCategoryDto } from '../../dtos/categories/update-category.dto';
import { CategoriesService } from 'src/infrastructure/modules/categories/categories.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { AuthenticationGuard } from '../../guards/authentication.guard';

@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Cria uma nova categoria' })
  @ApiBody({
    type: CreateCategoryDto,
    description: 'Dados para criação da categoria',
  })
  @UseGuards(AuthenticationGuard)
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lista todas as categorias' })
  findAll() {
    return this.categoriesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Busca uma categoria pelo ID' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID da categoria',
    example: 5,
  })
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualiza os dados de uma categoria existente' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID da categoria a ser atualizada',
    example: 5,
  })
  @ApiBody({
    type: UpdateCategoryDto,
    description: 'Campos da categoria que podem ser atualizados',
  })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AuthenticationGuard)
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(+id, updateCategoryDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove uma categoria pelo ID' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID da categoria a ser removida',
    example: 5,
  })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AuthenticationGuard)
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(+id);
  }
}
