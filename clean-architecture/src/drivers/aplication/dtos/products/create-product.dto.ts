import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

class ProductItemDto {
  @ApiProperty({ description: 'ID do item', example: 1 })
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @ApiProperty({ description: 'Se o item é essencial', example: true })
  @IsBoolean()
  @IsNotEmpty()
  essential: boolean;

  @ApiProperty({ description: 'Quantidade do item', example: 2 })
  @IsNumber()
  @IsNotEmpty()
  quantity: number;

  @ApiProperty({
    description: 'Se o item pode ser customizado',
    example: false,
  })
  @IsBoolean()
  @IsNotEmpty()
  customizable: boolean;
}

export class CreateProductDto {
  @ApiProperty({
    description: 'Nome do produto',
    example: 'Hambúrguer Especial',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  name: string;

  @ApiProperty({ description: 'ID da categoria do produto', example: 3 })
  @IsNumber()
  @IsNotEmpty()
  category: number;

  @ApiProperty({
    description: 'Descrição do produto',
    example: 'Hambúrguer com queijo, bacon e cebola caramelizada.',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  description: string;

  @ApiProperty({ description: 'Valor do produto', example: 24.9 })
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @ApiProperty({
    description: 'URL da imagem do produto',
    example: 'https://exemplo.com/imagem.jpg',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  url_img: string;

  @ApiProperty({ description: 'Produto pode ser customizado?', example: true })
  @IsBoolean()
  @IsNotEmpty()
  customizable: boolean;

  @ApiProperty({
    description: 'Produto está disponível para venda?',
    example: true,
  })
  @IsBoolean()
  @IsNotEmpty()
  available: boolean;

  @ApiProperty({
    description: 'Itens que compõem o produto ( opcional )',
    type: [ProductItemDto],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductItemDto)
  productItems: ProductItemDto[];
}
