/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import {
  OrderResponseInterface,
  OrdersInterface,
} from 'src/core/domain/dtos/orders/orders.db.interface';

export class OrderMapper {
  static toDomain(data: OrdersInterface): OrderResponseInterface {
    return {
      ...data,
      id: data.id,
      status: data.status,
      amount: data.amount as any,
      transactionId: data.transactionId ?? '',
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      ...(!!data?.observation && { observation: data.observation ?? '' }),
      items: data.items.map((item) => ({
        id: item.id,
        productId: item.productId,
        quantity: item.quantity,
        title: item.title,
        description: item.description ?? '',
        photo: item.photo ?? '',
        unitPrice: item.unitPrice as any,
        price: item.price as any,
        ...(!!item.observation && { observation: item.observation }),
        orderId: item.orderId,
        customerItems: item.customerItems?.map((customerItem) => ({
          itemId: customerItem.itemId,
          quantity: customerItem.quantity,
          title: customerItem.title,
          description: customerItem.description ?? '',
          photo: customerItem.photo ?? '',
          unitPrice: item.unitPrice as any,
          price: customerItem.price as any,
          ...(!!customerItem.observation && {
            observation: customerItem.observation,
          }),
        })),
      })),
    };
  }
}
