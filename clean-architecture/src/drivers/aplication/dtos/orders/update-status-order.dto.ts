import { IsEnum } from 'class-validator';
import { OrderStatus } from 'src/core/domain/value-objects/orders/order-status.enum';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateStatusOrderDto {
  @ApiProperty({
    description: 'Novo status do pedido',
    enum: OrderStatus,
    example: '',
  })
  @IsEnum(OrderStatus)
  status: OrderStatus;
}
