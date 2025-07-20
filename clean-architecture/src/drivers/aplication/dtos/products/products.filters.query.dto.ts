import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationQueryDto } from '../common/pagination.query.dto';

export class ProductsFiltersQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({ description: 'ID do produto', example: '' })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  id?: number;

  @Type(() => String)
  @ApiPropertyOptional({
    description: 'Nome do produto (busca parcial)',
    example: '',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: 'ID da categoria', example: '' })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  categoryId?: number;
}
