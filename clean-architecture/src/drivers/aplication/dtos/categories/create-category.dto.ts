import { IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({
    description: 'Nome da categoria',
    example: 'Bebidas',
  })
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({
    description: 'Descrição da categoria',
    example: 'Categoria destinada a bebidas frias e quentes.',
  })
  @IsOptional()
  description?: string;
}
