import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infrastructure/config/database/prisma/prisma.service';
import { OrderRepositoryInterface } from 'src/core/application/ports/output/repositories/orders/orders.repository.interface';
import {
  OrderCreateInterface,
  OrderResponseInterface,
  OrdersQueryFiltersInterface,
  UpdateOrderStatusInterface,
} from 'src/core/domain/dtos/orders/orders.db.interface';
import { OrderStatus } from 'src/core/domain/value-objects/orders/order-status.enum';
import { OrderMapper } from '../../mappers/orders/order.mapper';
import {
  PaginatedResponse,
  PaginationMapper,
} from '../../mappers/common/pagination.mappers';
import { ClientEntity } from 'src/core/domain/entities/clients/clients.entity';

@Injectable()
export class OrderRepository implements OrderRepositoryInterface {
  constructor(private readonly prismaService: PrismaService) {}

  async create(data: OrderCreateInterface): Promise<OrderResponseInterface> {
    return await this.prismaService.$transaction(async (prisma) => {
      const { items, clientId, ...orderData } = data;

      const createdOrder = await prisma.order.create({
        data: {
          ...orderData,
          ...(!!clientId && {
            client: {
              connect: { id: Number(clientId) },
            },
          }),
        },
        include: { client: true },
      });

      for (const item of items) {
        const { customerItems, ...itemData } = item;

        const createdItem = await prisma.orderItem.create({
          data: {
            ...itemData,
            order_id: createdOrder.id,
          },
        });

        if (customerItems?.length) {
          const customerItemsData = customerItems.map((ci) => ({
            ...ci,
            productId: item.productId,
            orderItemId: createdItem.id,
          }));

          await prisma.orderCustomerItem.createMany({
            data: customerItemsData,
          });
        }
      }

      const fullOrder = await prisma.order.findUniqueOrThrow({
        where: { id: createdOrder.id },
        include: {
          items: { include: { customerItems: true } },
          client: true,
        },
      });

      return OrderMapper.toDomain({
        ...fullOrder,
        client: fullOrder.client as ClientEntity,
        items: fullOrder.items as [],
        status: fullOrder.status as OrderStatus,
      });
    });
  }

  async findById(id: number): Promise<OrderResponseInterface | null> {
    const found = await this.prismaService.order.findUnique({
      where: { id },
      include: { items: { include: { customerItems: true } }, client: true },
    });

    if (!found) {
      return null;
    }

    return OrderMapper.toDomain({
      ...found,
      items: found.items as [],
      client: found.client as unknown as ClientEntity,
      status: found.status as OrderStatus,
    });
  }

  async findByTransactionId(
    transactionId: string,
  ): Promise<OrderResponseInterface | null> {
    const found = await this.prismaService.order.findUnique({
      where: { transactionId },
      include: { items: { include: { customerItems: true } }, client: true },
    });

    if (!found) {
      return null;
    }

    return OrderMapper.toDomain({
      ...found,
      items: found.items as [],
      client: found.client as unknown as ClientEntity,
      status: found.status as OrderStatus,
    });
  }

  async updateStatus(id: number, status: OrderStatus): Promise<void> {
    await this.prismaService.order.update({
      where: { id },
      data: { status },
    });
  }

  async delete(id: number): Promise<void> {
    await this.prismaService.order.delete({ where: { id } });
  }

  async findAll({
    page: filterPage,
    limit: filtersLimit,
    id,
    order,
    orderBy,
    status,
  }: OrdersQueryFiltersInterface): Promise<
    PaginatedResponse<OrderResponseInterface>
  > {
    const page = filterPage ?? 1;
    const limit = filtersLimit ?? 10;
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      this.prismaService.order.findMany({
        skip,
        take: limit,
        orderBy: { [orderBy as string]: order },
        where: {
          ...(id && { id }),
          ...(status && { status }),
        },
        include: { items: { include: { customerItems: true } }, client: true },
      }),
      this.prismaService.order.count({
        where: {
          ...(id && { id }),
          ...(status && { status }),
        },
      }),
    ]);

    const totalPages = Math.ceil(total / limit);
    return PaginationMapper.mappedPaginationResults({
      data: orders.map((order) => ({
        ...order,
        items: order.items as [],
        client: order.client as unknown as ClientEntity,
        status: order.status as OrderStatus,
      })),
      meta: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  }

  async update(
    id: number,
    order: OrderCreateInterface,
  ): Promise<OrderResponseInterface> {
    const { items, ...orderData } = order;
    const updated = await this.prismaService.order.update({
      where: { id },
      data: {
        ...orderData,
        ...(!!items?.length && {
          items: {
            deleteMany: {},
            create: items.map((item) => {
              const { customerItems, ...rest } = item;
              return {
                ...rest,
                ...(customerItems && customerItems.length > 0
                  ? {
                      customerItems: {
                        create: customerItems.map((customerItem) => ({
                          productId: item.productId ?? item.productId,
                          quantity: customerItem.quantity,
                          observation: customerItem.observation,
                          price: Number(customerItem.price),
                        })),
                      },
                    }
                  : {}),
              };
            }),
          },
        }),
      },
      include: { items: { include: { customerItems: true } }, client: true },
    });

    return OrderMapper.toDomain({
      ...updated,
      items: updated.items as [],
      client: updated.client as unknown as ClientEntity,
      status: updated.status as OrderStatus,
    });
  }

  async findAllReadyToPrepare({
    page: filterPage,
    limit: filtersLimit,
    id,
    order,
    orderBy,
  }: OrdersQueryFiltersInterface): Promise<
    PaginatedResponse<OrderResponseInterface>
  > {
    const page = filterPage ?? 1;
    const limit = filtersLimit ?? 10;
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      this.prismaService.order.findMany({
        skip,
        take: limit,
        orderBy: { [orderBy as string]: order },
        where: {
          ...(id && { id }),
          status: OrderStatus.PAID,
        },
        include: { items: { include: { customerItems: true } }, client: true },
      }),
      this.prismaService.order.count({
        where: {
          ...(id && { id }),
          status: OrderStatus.PAID,
        },
      }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return PaginationMapper.mappedPaginationResults({
      data: orders.map((order) => ({
        ...order,
        items: order.items as [],
        client: order.client as unknown as ClientEntity,
        status: order.status as OrderStatus,
      })),
      meta: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  }

  async findAllReadyToDeliver({
    page: filterPage,
    limit: filtersLimit,
    id,
    order,
    orderBy,
  }: OrdersQueryFiltersInterface): Promise<
    PaginatedResponse<OrderResponseInterface>
  > {
    const page = filterPage ?? 1;
    const limit = filtersLimit ?? 10;
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      this.prismaService.order.findMany({
        skip,
        take: limit,
        orderBy: { [orderBy as string]: order },
        where: {
          ...(id && { id }),
          status: OrderStatus.READY_TO_DELIVER,
        },
        include: { items: { include: { customerItems: true } }, client: true },
      }),
      this.prismaService.order.count({
        where: {
          ...(id && { id }),
          status: OrderStatus.READY_TO_DELIVER,
        },
      }),
    ]);

    const totalPages = Math.ceil(total / limit);
    return PaginationMapper.mappedPaginationResults({
      data: orders.map((order) => ({
        ...order,
        items: order.items as [],
        client: order.client as unknown as ClientEntity,
        status: order.status as OrderStatus,
      })),
      meta: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  }

  async initiatePreparation(
    id: number,
    { status }: UpdateOrderStatusInterface,
  ): Promise<OrderResponseInterface> {
    const order = await this.prismaService.order.update({
      where: { id },
      data: {
        status,
        updatedAt: new Date(),
      },
      include: { items: { include: { customerItems: true } }, client: true },
    });

    return OrderMapper.toDomain({
      ...order,
      items: order.items as [],
      client: order.client as unknown as ClientEntity,
      status: order.status as OrderStatus,
    });
  }

  async finishPreparation(
    id: number,
    { status }: UpdateOrderStatusInterface,
  ): Promise<OrderResponseInterface> {
    const order = await this.prismaService.order.update({
      where: { id },
      data: {
        status,
        updatedAt: new Date(),
      },
      include: { items: { include: { customerItems: true } }, client: true },
    });

    return OrderMapper.toDomain({
      ...order,
      items: order.items as [],
      client: order.client as unknown as ClientEntity,
      status: order.status as OrderStatus,
    });
  }

  async updateStatusWithTransactionId(
    orderId: number,
    transactionId: string,
    status: OrderStatus,
  ): Promise<OrderResponseInterface> {
    const order = await this.prismaService.order.update({
      where: { id: orderId },
      data: { status, transactionId },
      include: { items: { include: { customerItems: true } }, client: true },
    });

    return OrderMapper.toDomain({
      ...order,
      items: order.items as [],
      client: order.client as unknown as ClientEntity,
      status: order.status as OrderStatus,
    });
  }

  async finishOrder(
    id: number,
    { status }: UpdateOrderStatusInterface,
  ): Promise<OrderResponseInterface> {
    const order = await this.prismaService.order.update({
      where: { id },
      data: {
        status,
        updatedAt: new Date(),
      },
      include: { items: { include: { customerItems: true } }, client: true },
    });

    return OrderMapper.toDomain({
      ...order,
      items: order.items as [],
      client: order.client as unknown as ClientEntity,
      status: order.status as OrderStatus,
    });
  }
}
