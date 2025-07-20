import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationQueryDto } from '../common/pagination.query.dto';

export class CollaboratorsFiltersQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({ description: 'ID do colaborador', example: '' })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  id?: number;

  @ApiPropertyOptional({ description: 'Nome do colaborador', example: '' })
  @IsOptional()
  @IsString()
  @Type(() => String)
  name?: string;
}
