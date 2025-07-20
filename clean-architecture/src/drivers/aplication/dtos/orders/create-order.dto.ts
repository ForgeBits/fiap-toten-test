import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { OrderStatus } from 'src/core/domain/value-objects/orders/order-status.enum';

export class CreateCustomerItemDto {
  @ApiPropertyOptional({ description: 'ID do item adicional (opcional)' })
  @IsOptional()
  @IsNumber()
  itemId: number;

  @IsString()
  @ApiPropertyOptional({ description: 'Titulo do item adicional (opcional)' })
  title: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  photo: string;

  @ApiProperty({ description: 'Quantidade do item do cliente' })
  @IsNumber()
  quantity: number;

  @ApiProperty({ description: 'Preço do item do cliente' })
  @IsNumber()
  price: number;

  @ApiPropertyOptional({ description: 'Observações sobre o item do cliente' })
  @IsString()
  observation?: string;
}

export class CreateOrderItemDto {
  @ApiProperty({ description: 'ID do produto' })
  @IsNumber()
  productId: number;

  @IsString()
  @ApiPropertyOptional({
    description: 'Titulo do produto escolhido (opcional)',
  })
  title: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  photo: string;

  @ApiProperty({ description: 'Quantidade do produto' })
  @IsNumber()
  quantity: number;

  @ApiProperty({ description: 'Preço do produto' })
  @IsNumber()
  price: number;

  @IsOptional()
  @IsNumber()
  unitPrice: number;

  @ApiPropertyOptional({ description: 'Observações sobre o produto' })
  @IsString()
  observation?: string;

  @ApiProperty({
    description: 'Lista de itens personalizados do cliente',
    type: [CreateCustomerItemDto],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateCustomerItemDto)
  customerItems: CreateCustomerItemDto[];
}

export class CreateOrderDto {
  @ApiProperty({ description: 'ID do cliente' })
  @IsOptional()
  @IsNumber()
  clientId?: number;

  @IsOptional()
  @IsNumber()
  establishmentId?: number;

  @ApiPropertyOptional({ description: 'Código aleatório do cliente' })
  @IsOptional()
  @IsNumber()
  codeClientRandom?: number;

  @ApiPropertyOptional({ description: 'Cliente aleatório?' })
  @IsOptional()
  @IsBoolean()
  isRandomClient?: boolean;

  @ApiProperty({ description: 'Valor total do pedido' })
  @IsNumber()
  amount: number;

  @IsOptional()
  @IsString()
  transactionId: string;

  @IsOptional()
  @IsEnum(OrderStatus)
  status: OrderStatus.PENDING;

  @ApiProperty({
    description: 'Lista de itens do pedido',
    type: [CreateOrderItemDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[];
}
