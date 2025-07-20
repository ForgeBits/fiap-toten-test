import { ClientEntity } from '../clients/clients.entity';

interface PaymentDataItem {
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

export class PaymentEntity {
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
