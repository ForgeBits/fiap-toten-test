import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppError } from '../../../../core/domain/errors/app.error';
import axios from 'axios';
import { PaymentRepositoryInterface } from 'src/core/application/ports/output/repositories/payment/payment.repository.interface';
import {
  CreatePaymentInterface,
  PaymentExternalResponseDataInterface,
  PaymentInterfaceResponse,
} from 'src/core/domain/dtos/payment/payment.db.interface';
import { generatePaymentUUID } from 'src/infrastructure/shared/utils/payment.util';
import { PaymentMapper } from '../../persistence/mappers/payment/payment.mapper';
import { OrdersInterface } from 'src/core/domain/dtos/orders/orders.db.interface';

@Injectable()
export class PaymentServiceImpl implements PaymentRepositoryInterface {
  private readonly apiBaseUrl: string;
  private readonly paymentAccessToken: string;

  constructor(private readonly configService: ConfigService) {
    this.apiBaseUrl =
      this.configService.get<string>('paymentServiceBaseUrl') ?? '';
    this.paymentAccessToken =
      this.configService.get<string>('paymentAccessToken') ?? '';

    if (!this.paymentAccessToken) {
      console.error('MERCADO_PAGO_ACCESS_TOKEN is not configured');
    }
  }

  async createPayment(
    data: CreatePaymentInterface,
    order?: OrdersInterface,
  ): Promise<PaymentInterfaceResponse> {
    try {
      const payload = PaymentMapper.toExternalService(data, order);
      const response = await axios.post(
        `${this.apiBaseUrl}/payments`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${this.paymentAccessToken}`,
            'Content-Type': 'application/json',
            'X-Idempotency-Key': generatePaymentUUID(),
          },
        },
      );

      if (response.status !== 201) {
        throw AppError.internal({
          message: 'Error generating payment',
          details: response.data,
        });
      }

      return PaymentMapper.toDomain(
        response.data as PaymentExternalResponseDataInterface,
        order,
      );
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      throw AppError.internal({
        message: 'Failed to generate payment',
        details: axios.isAxiosError(error)
          ? error.response?.data
          : error instanceof Error
            ? error.message
            : String(error),
      });
    }
  }

  async getPaymentStatus(
    transactionId: string,
  ): Promise<PaymentInterfaceResponse> {
    try {
      const response = await axios.get(
        `${this.apiBaseUrl}/payments/${transactionId}`,
        {
          headers: {
            Authorization: `Bearer ${this.paymentAccessToken}`,
          },
        },
      );

      if (response.status !== 200) {
        throw AppError.internal({
          message: 'Error getting payment status',
          details: response.data,
        });
      }

      return PaymentMapper.toDomain(
        response.data as PaymentExternalResponseDataInterface,
      );
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      throw AppError.internal({
        message: 'Failed to get payment status',
        details: axios.isAxiosError(error)
          ? error.response?.data
          : error instanceof Error
            ? error.message
            : String(error),
      });
    }
  }

  async cancelPayment(transactionId: string): Promise<void> {
    try {
      const response = await axios.put(
        `${this.apiBaseUrl}/payments/${transactionId}`,
        { status: 'cancelled' },
        {
          headers: {
            Authorization: `Bearer ${this.paymentAccessToken}`,
            'Content-Type': 'application/json',
          },
        },
      );

      if (response.status !== 200) {
        throw AppError.internal({
          message: 'Error cancelling payment',
          details: response.data,
        });
      }
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      throw AppError.internal({
        message: 'Failed to cancel payment',
        details: axios.isAxiosError(error)
          ? error.response?.data
          : error instanceof Error
            ? error.message
            : String(error),
      });
    }
  }
}
