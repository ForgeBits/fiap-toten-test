import { Inject, Injectable } from '@nestjs/common';
import { CreateOrderDto } from 'src/drivers/aplication/dtos/orders/create-order.dto';
import { UpdateOrderDto } from 'src/drivers/aplication/dtos/orders/update-order.dto';
import { OrderUseCases } from 'src/core/application/ports/input/orders/orders.use-case.port';
import { OrderStatus } from 'src/core/domain/value-objects/orders/order-status.enum';
import { TOKENS } from 'src/core/application/constants/injection.tokens';
import { OrdersEntity } from 'src/core/domain/entities/orders/orders.entity';
import { PaginatedResult } from 'src/core/domain/dtos/common/pagination.query.db.interface';
import { OrdersFiltersQueryDto } from 'src/drivers/aplication/dtos/orders/orders.filters.query.dto';
import { UpdateStatusOrderDto } from 'src/drivers/aplication/dtos/orders/update-status-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @Inject(TOKENS.ORDER_USE_CASES)
    private readonly orderUseCase: OrderUseCases,
  ) {}

  async create(createOrderDto: CreateOrderDto) {
    return this.orderUseCase.create(createOrderDto);
  }

  async findAll(
    filters: OrdersFiltersQueryDto,
  ): Promise<PaginatedResult<OrdersEntity>> {
    return await this.orderUseCase.findAll(filters);
  }

  async findOne(id: number) {
    return this.orderUseCase.findById(id);
  }

  async update(id: number, { status }: UpdateOrderDto) {
    return this.orderUseCase.updateStatus(id, status as OrderStatus);
  }

  async remove(id: number) {
    await this.orderUseCase.delete(id);
  }

  async findAllReadyToPrepare(
    filters: OrdersFiltersQueryDto,
  ): Promise<PaginatedResult<OrdersEntity>> {
    return await this.orderUseCase.findAllReadyToPrepare(filters);
  }

  async findAllReadyToDeliver(
    filters: OrdersFiltersQueryDto,
  ): Promise<PaginatedResult<OrdersEntity>> {
    return await this.orderUseCase.findAllReadyToDeliver(filters);
  }

  async initiatePreparation(
    id: number,
    updateOrderStatusDto: UpdateStatusOrderDto,
  ): Promise<OrdersEntity> {
    return await this.orderUseCase.initiatePreparation(
      id,
      updateOrderStatusDto,
    );
  }

  async finishPreparation(
    id: number,
    updateOrderStatusDto: UpdateStatusOrderDto,
  ): Promise<OrdersEntity> {
    return await this.orderUseCase.finishPreparation(id, updateOrderStatusDto);
  }

  async finishOrder(
    id: number,
    updateOrderStatusDto: UpdateStatusOrderDto,
  ): Promise<OrdersEntity> {
    return await this.orderUseCase.finishOrder(id, updateOrderStatusDto);
  }
}
