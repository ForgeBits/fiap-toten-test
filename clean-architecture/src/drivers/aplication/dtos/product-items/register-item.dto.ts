import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterItemDto {
  @ApiProperty({
    description: 'Nome do item',
    example: 'Bacon',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Descrição do item',
    example: 'Fatias crocantes de bacon defumado',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'Valor do item (unitário)',
    example: 3.5,
  })
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @ApiPropertyOptional({
    description: 'Quantidade disponível do item no estoque',
    example: 100,
  })
  @IsNumber()
  @IsOptional()
  quantity: number;
}
