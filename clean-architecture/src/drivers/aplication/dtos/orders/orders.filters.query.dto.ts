import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { OrderStatus } from 'src/core/domain/value-objects/orders/order-status.enum';
import { PaginationQueryDto } from '../common/pagination.query.dto';

export class OrdersFiltersQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({ description: 'ID do pedido' })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  id?: number;

  @ApiPropertyOptional({ description: 'ID do cliente' })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  clientId?: number;

  @ApiPropertyOptional({ description: 'Status do pedido', enum: OrderStatus })
  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;
}
