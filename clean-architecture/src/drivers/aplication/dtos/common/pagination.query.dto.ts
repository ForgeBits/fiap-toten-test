import { IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class PaginationQueryDto {
  @ApiPropertyOptional({ description: 'Pagina utilizada para paginação' })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  page: number = 1;

  @ApiPropertyOptional({ description: 'Limite utilizada para paginação' })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  limit: number = 10;

  @ApiPropertyOptional({ description: 'Paramêtro utilizado para ordenação' })
  @IsOptional()
  @IsString()
  orderBy?: string;

  @ApiPropertyOptional({ description: 'Ordenação ASC ou DESC' })
  @IsOptional()
  @IsString()
  order?: 'asc' | 'desc' = 'asc';
}
