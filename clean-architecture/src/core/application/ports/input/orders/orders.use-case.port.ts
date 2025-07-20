import {
  OrderCreateInterface,
  OrdersQueryFiltersInterface,
  OrderUpdateInterface,
  UpdateOrderStatusInterface,
} from 'src/core/domain/dtos/orders/orders.db.interface';
import { OrdersEntity } from 'src/core/domain/entities/orders/orders.entity';
import { PaginatedResponse } from 'src/infrastructure/adapters/persistence/mappers/common/pagination.mappers';

export interface OrderUseCases {
  findAll(
    filters: OrdersQueryFiltersInterface,
  ): Promise<PaginatedResponse<OrdersEntity>>;
  findById(id: number): Promise<OrdersEntity>;
  create(data: OrderCreateInterface): Promise<OrdersEntity>;
  update(id: number, data: OrderUpdateInterface): Promise<OrdersEntity>;
  delete(id: number): Promise<void>;
  updateStatus(id: number, status: string): Promise<void>;
  findAllReadyToPrepare(
    filters: OrdersQueryFiltersInterface,
  ): Promise<PaginatedResponse<OrdersEntity>>;
  findAllReadyToDeliver(
    filters: OrdersQueryFiltersInterface,
  ): Promise<PaginatedResponse<OrdersEntity>>;
  initiatePreparation(
    id: number,
    updated: UpdateOrderStatusInterface,
  ): Promise<OrdersEntity>;
  finishPreparation(
    id: number,
    updated: UpdateOrderStatusInterface,
  ): Promise<OrdersEntity>;
  finishOrder(
    id: number,
    updated: UpdateOrderStatusInterface,
  ): Promise<OrdersEntity>;
}
