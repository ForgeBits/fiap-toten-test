import { ClientEntity } from '../../entities/clients/clients.entity';

export enum PaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  CANCELED = 'CANCELED',
  EXPIRED = 'EXPIRED',
  FAILED = 'FAILED',
}

export enum PaymentExternalStatus {
  APPROVED = 'approved',
  CANCELLED = 'cancelled',
  REJECTED = 'rejected',
  EXPIRED = 'expired',
  PENDING = 'pending',
}

export interface CreatePaymentInterface {
  amount: number;
  description: string;
  orderId?: number;
  callbackUrl?: string;
  expirationMinutes?: number;
}

export interface PaymentInterfaceResponse {
  id: number;
  transactionId: string;
  qrCodeBase64?: string;
  qrCodeString?: string;
  urlPayment: string;
  amount: number;
  expirationDate?: Date;
  client?: ClientEntity | null;
  status: string;
  created_at: Date;
  updated_at?: Date;
  orderId?: number;
  items?: PaymentDataItem[];
}

export interface PaymentExternalResponseDataInterface {
  id: number;
  status: PaymentExternalStatus | string;
  transaction_amount: number;
  date_of_expiration?: string;
  date_created: string;
  date_updated: string;
  external_reference?: string;
  point_of_interaction?: {
    transaction_data?: {
      qr_code_base64?: string;
      qr_code?: string;
      ticket_url?: string;
    };
  };
  additional_info: {
    items?: PaymentDataItem[];
    payer?: PaymentDataPayer;
  };
}

// external payment interfaces

export interface PaymentDataItem {
  id: string;
  title: string;
  description: string;
  picture_url: string;
  category_id: string;
  quantity: number;
  unit_price: number;
  type: string;
  event_date: string;
  warranty: boolean;
}

export interface PaymentDataPayerIdentification {
  type: string;
  number: string;
}

export interface PaymentDataPayer {
  email: string;
  first_name: string;
  last_name: string;
  identification: PaymentDataPayerIdentification;
}

export interface PaymentDataAdditionalInfo {
  items: PaymentDataItem[];
}

export interface PaymentExternalSentDataInterface {
  transaction_amount: number;
  description: string;
  payment_method_id: string;
  payer?: PaymentDataPayer;
  external_reference: string;
  additional_info: PaymentDataAdditionalInfo;
}
