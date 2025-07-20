import {
  CreatePaymentInterface,
  PaymentExternalResponseDataInterface,
  PaymentExternalSentDataInterface,
  PaymentExternalStatus,
  PaymentInterfaceResponse,
} from 'src/core/domain/dtos/payment/payment.db.interface';
import { mapToDomainPaymentStatus } from '../enum-mapper.util';
import {
  OrderItemInterface,
  OrdersInterface,
} from 'src/core/domain/dtos/orders/orders.db.interface';
import {
  removeMask,
  splitNamePayment,
} from 'src/infrastructure/shared/utils/strings.utils';
import { generateExternalReference } from 'src/infrastructure/shared/utils/payment.util';

const mockRandomPayer = {
  email: 'payer.teste@gmail.com',
  name: 'Payer Random',
  document: '330.731.328-21',
};

export class PaymentMapper {
  /**
   * Maps order items to the format required by the external payment service.
   *
   * @param items - The order items to be mapped.
   * @returns An array of mapped items suitable for the external payment service.
   */
  static mapperItemsPayment(items: OrderItemInterface[]) {
    const mappedItems = items.flatMap(({ customerItems = [], ...item }) => [
      item,
      ...customerItems,
    ]) as OrderItemInterface[];

    return mappedItems.map((item) => {
      return {
        id: item?.id?.toString() ?? '',
        title: item.title,
        description: item.description ?? '',
        picture_url: item.photo ?? '',
        category_id: '',
        quantity: item.quantity,
        unit_price: Number(item.unitPrice ?? 0),
        type: '',
        event_date: new Date().toISOString(),
        warranty: false,
      };
    });
  }

  /**
   * Maps the external payment response data to a domain payment response object.
   *
   * @param data - The external payment response data.
   * @param order - The associated order, if available.
   * @returns A domain payment response object.
   */
  static toDomain(
    data: PaymentExternalResponseDataInterface,
    order?: OrdersInterface,
  ): PaymentInterfaceResponse {
    return {
      id: data.id,
      orderId: order?.id ?? Number(data.external_reference),
      transactionId: data.id.toString(),
      status: mapToDomainPaymentStatus(data.status as PaymentExternalStatus),
      amount: data.transaction_amount,
      urlPayment: data.point_of_interaction?.transaction_data?.ticket_url ?? '',
      items: data.additional_info?.items ?? [],
      qrCodeString: data.point_of_interaction?.transaction_data?.qr_code ?? '',
      created_at: new Date(data.date_created),
      ...(!!data?.date_updated && {
        updated_at: new Date(data.date_updated),
      }),
    };
  }

  /**
   * Converts the CreatePaymentInterface data to an external service format.
   *
   * @param data - The payment creation data.
   * @param order - The associated order, if available.
   * @returns A formatted object for the external payment service.
   */
  static toExternalService(
    data: CreatePaymentInterface,
    order?: OrdersInterface,
  ): PaymentExternalSentDataInterface {
    const client = order?.client ?? mockRandomPayer;
    const { firstName, lastName } = splitNamePayment(client?.name ?? '');
    const formattedDocument = removeMask(
      client?.document ?? '',
      '999.999.999-99',
    );

    return {
      transaction_amount: data.amount,
      description: data.description,
      payment_method_id: 'pix',
      payer: {
        email: client?.email ?? '',
        first_name: firstName,
        last_name: lastName,
        identification: {
          type: 'CPF',
          number: formattedDocument,
        },
      },
      external_reference: generateExternalReference(),
      additional_info: {
        items: this.mapperItemsPayment(order?.items ?? []),
      },
    };
  }
}
