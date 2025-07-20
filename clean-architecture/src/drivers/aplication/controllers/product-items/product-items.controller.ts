import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ProductItemsService } from '../../../../infrastructure/modules/product-items/product-items.service';
import { RegisterItemDto } from '../../dtos/product-items/register-item.dto';
import { UpdateProductItemDto } from '../../dtos/product-items/update-product-item.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';
import { AuthenticationGuard } from '../../guards/authentication.guard';

@Controller('product-items')
export class ProductItemsController {
  constructor(private readonly productItemsService: ProductItemsService) {}

  @Post('register')
  @ApiOperation({ summary: 'Registra um novo item de produto' })
  @ApiBody({
    type: RegisterItemDto,
    description: 'Dados do item a ser registrado',
  })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AuthenticationGuard)
  @Post('register')
  registerItem(@Body() registerItemDto: RegisterItemDto) {
    return this.productItemsService.registerItem(registerItemDto);
  }

  @Get('get-all')
  @ApiOperation({ summary: 'Lista todos os itens de produto cadastrados' })
  getAllItems() {
    return this.productItemsService.getAllItems();
  }

  @Put('update/:id')
  @ApiOperation({ summary: 'Atualiza um item de produto existente pelo ID' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'ID do item a ser atualizado',
    example: '64fa10e234ad7b001e6b5a9d',
  })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AuthenticationGuard)
  @ApiBody({
    type: UpdateProductItemDto,
    description: 'Dados do item a serem atualizados',
  })
  @Put('update/:id')
  updateItem(
    @Param('id') id: string,
    @Body() updateItemDto: UpdateProductItemDto,
  ) {
    return this.productItemsService.updateItem(id, updateItemDto);
  }

  @ApiOperation({ summary: 'Remove um item de produto pelo ID' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'ID do item a ser removido',
    example: '64fa10e234ad7b001e6b5a9d',
  })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AuthenticationGuard)
  @Delete('delete/:id')
  deleteItem(@Param('id') id: string) {
    return this.productItemsService.deleteItem(id);
  }
}
