import { OrderStatus } from 'src/core/domain/value-objects/orders/order-status.enum';
import {
  OrderCreateInterface,
  OrderUpdateInterface,
  OrderResponseInterface,
  OrdersQueryFiltersInterface,
  UpdateOrderStatusInterface,
} from 'src/core/domain/dtos/orders/orders.db.interface';
import { PaginatedResponse } from 'src/infrastructure/adapters/persistence/mappers/common/pagination.mappers';

export interface OrderRepositoryInterface {
  create(order: OrderCreateInterface): Promise<OrderResponseInterface>;
  findById(id: number): Promise<OrderResponseInterface | null>;
  findByTransactionId(
    transactionId: string,
  ): Promise<OrderResponseInterface | null>;
  update(
    id: number,
    order: OrderUpdateInterface,
  ): Promise<OrderResponseInterface>;
  updateStatus(id: number, status: OrderStatus): Promise<void>;
  updateStatusWithTransactionId(
    orderId: number,
    transactionId: string,
    status: OrderStatus,
  ): Promise<OrderResponseInterface>;
  delete(id: number): Promise<void>;
  findAll(
    filters: OrdersQueryFiltersInterface,
  ): Promise<PaginatedResponse<OrderResponseInterface>>;
  findAllReadyToPrepare(
    filters: OrdersQueryFiltersInterface,
  ): Promise<PaginatedResponse<OrderResponseInterface>>;
  findAllReadyToDeliver(
    filters: OrdersQueryFiltersInterface,
  ): Promise<PaginatedResponse<OrderResponseInterface>>;
  initiatePreparation(
    id: number,
    updated: UpdateOrderStatusInterface,
  ): Promise<OrderResponseInterface>;
  finishPreparation(
    id: number,
    updated: UpdateOrderStatusInterface,
  ): Promise<OrderResponseInterface>;
  finishOrder(
    id: number,
    updated: UpdateOrderStatusInterface,
  ): Promise<OrderResponseInterface>;
}
