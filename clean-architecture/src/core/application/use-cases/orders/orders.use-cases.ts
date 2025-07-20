import { Injectable, Inject } from '@nestjs/common';
import { AppError } from '../../../domain/errors/app.error';
import { handleServiceError } from '../../../../infrastructure/shared/utils/error.handler.util';
import { OrderUseCases } from '../../ports/input/orders/orders.use-case.port';
import { OrderRepositoryInterface } from '../../ports/output/repositories/orders/orders.repository.interface';
import { OrdersEntity } from 'src/core/domain/entities/orders/orders.entity';
import { OrderStatus } from 'src/core/domain/value-objects/orders/order-status.enum';
import {
  OrderCreateInterface,
  OrderResponseInterface,
  OrdersQueryFiltersInterface,
  OrderUpdateInterface,
} from 'src/core/domain/dtos/orders/orders.db.interface';
import { TOKENS } from '../../constants/injection.tokens';
import { PaginatedResponse } from 'src/infrastructure/adapters/persistence/mappers/common/pagination.mappers';
import { ClientsUseCases } from '../../ports/input/clients/clients.use-case.port';
import { PaymentUseCases } from '../../ports/input/payment/payment.use-case.port';
import { ProductUseCases } from '../../ports/input/products/products.use-case.port';

@Injectable()
export class OrderUseCasesImpl implements OrderUseCases {
  constructor(
    @Inject(TOKENS.ORDER_REPOSITORY)
    private readonly repository: OrderRepositoryInterface,
    @Inject(TOKENS.CLIENTS_USE_CASES)
    private readonly clientUseCase: ClientsUseCases,
    @Inject(TOKENS.PAYMENT_USE_CASES)
    private readonly paymentUseCases: PaymentUseCases,
    @Inject(TOKENS.PRODUCTS_USE_CASES)
    private readonly productUseCases: ProductUseCases,
  ) {}

  async findAll(
    filters: OrdersQueryFiltersInterface,
  ): Promise<PaginatedResponse<OrdersEntity>> {
    try {
      return await this.repository.findAll(filters);
    } catch (error) {
      handleServiceError(error, 'OrderUseCases.findAll');
    }
  }

  async findById(id: number): Promise<OrdersEntity> {
    try {
      const order = await this.repository.findById(id);
      if (!order) {
        throw AppError.notFound({
          message: 'Order not found',
        });
      }
      return order;
    } catch (error) {
      handleServiceError(error, 'OrderUseCases.findById');
    }
  }

  async create(data: OrderCreateInterface): Promise<OrderResponseInterface> {
    try {
      const productIds = data.items.map((item) => item.productId);

      if (!productIds.length) {
        throw AppError.badRequest({
          message: 'At least one product is required in the order',
        });
      }

      const products = await this.productUseCases.findProductsByIds(productIds);

      if (products.length !== productIds.length) {
        throw AppError.notFound({
          message: 'One or more products not found',
        });
      }

      if (!data?.isRandomClient && data.clientId) {
        const client = await this.clientUseCase.findById(data.clientId);
        if (!client) {
          throw AppError.notFound({
            message: 'Client not found',
          });
        }
      }

      const order = await this.repository.create({
        ...data,
        status: OrderStatus.PENDING,
      });

      const payment = await this.paymentUseCases.createPayment({
        orderId: order.id,
        amount: Number(order.amount),
        description: `Order #${order.id} payment`,
      });

      const updatedOrder = await this.repository.updateStatusWithTransactionId(
        order.id,
        payment.transactionId,
        OrderStatus.PAID,
      );

      return { ...updatedOrder, payment };
    } catch (error) {
      handleServiceError(error, 'OrderUseCases.create');
    }
  }

  async update(id: number, data: OrderUpdateInterface): Promise<OrdersEntity> {
    try {
      const existingOrder = await this.repository.findById(id);
      if (!existingOrder) {
        throw AppError.notFound({
          message: 'Order not found',
        });
      }

      return await this.repository.update(id, data);
    } catch (error) {
      handleServiceError(error, 'OrderUseCases.update');
    }
  }

  async delete(id: number): Promise<void> {
    try {
      const existingOrder = await this.repository.findById(id);
      if (!existingOrder) {
        throw AppError.notFound({
          message: 'Order not found',
        });
      }

      await this.repository.delete(id);
    } catch (error) {
      handleServiceError(error, 'OrderUseCases.delete');
    }
  }

  async updateStatus(id: number, status: OrderStatus): Promise<void> {
    try {
      const existingOrder = await this.repository.findById(id);
      if (!existingOrder) {
        throw AppError.notFound({
          message: 'Order not found',
        });
      }
      await this.repository.updateStatus(id, status);
    } catch (error) {
      handleServiceError(error, 'OrderUseCases.updateStatus');
    }
  }

  async findAllReadyToPrepare(
    filters: OrdersQueryFiltersInterface,
  ): Promise<PaginatedResponse<OrdersEntity>> {
    try {
      return await this.repository.findAllReadyToPrepare(filters);
    } catch (error) {
      handleServiceError(error, 'OrderUseCases.findAllReadyToPrepare');
    }
  }

  async findAllReadyToDeliver(
    filters: OrdersQueryFiltersInterface,
  ): Promise<PaginatedResponse<OrdersEntity>> {
    try {
      return await this.repository.findAllReadyToDeliver(filters);
    } catch (error) {
      handleServiceError(error, 'OrderUseCases.findAllReadyToDeliver');
    }
  }

  async initiatePreparation(
    id: number,
    updated: OrderUpdateInterface,
  ): Promise<OrdersEntity> {
    try {
      const existingOrder = await this.repository.findById(id);
      if (!existingOrder) {
        throw AppError.notFound({
          message: 'Order not found',
        });
      }
      return await this.repository.initiatePreparation(id, updated);
    } catch (error) {
      handleServiceError(error, 'OrderUseCases.initiatePreparation');
    }
  }

  async finishPreparation(
    id: number,
    updated: OrderUpdateInterface,
  ): Promise<OrdersEntity> {
    try {
      const existingOrder = await this.repository.findById(id);
      if (!existingOrder) {
        throw AppError.notFound({
          message: 'Order not found',
        });
      }

      const status = existingOrder.status as OrderStatus;
      if (status !== OrderStatus.IN_PREPARATION) {
        throw AppError.badRequest({
          message: 'Order is not in preparation status',
        });
      }

      return await this.repository.finishPreparation(id, updated);
    } catch (error) {
      handleServiceError(error, 'OrderUseCases.finishPreparation');
    }
  }

  async finishOrder(
    id: number,
    updated: OrderUpdateInterface,
  ): Promise<OrdersEntity> {
    try {
      const existingOrder = await this.repository.findById(id);
      if (!existingOrder) {
        throw AppError.notFound({
          message: 'Order not found',
        });
      }

      const status = existingOrder.status as OrderStatus;
      if (status !== OrderStatus.READY_TO_DELIVER) {
        throw AppError.badRequest({
          message: 'Order is not ready to deliver',
        });
      }

      return await this.repository.finishOrder(id, updated);
    } catch (error) {
      handleServiceError(error, 'OrderUseCases.finishOrder');
    }
  }
}
