/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Test, TestingModule } from '@nestjs/testing';
import { PaymentUseCasesImpl } from './payment.use-cases';
import { TOKENS } from '../../constants/injection.tokens';
import { AppError } from 'src/core/domain/errors/app.error';
import { OrderStatus } from 'src/core/domain/entities/orders/orders.entity';

const mockOrder = {
  id: 1,
  clientId: 1,
  status: OrderStatus.PENDING,
  amount: 100,
  transactionId: 'tx-1',
  observation: null,
  items: [],
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockPaymentResponse = {
  id: 1,
  transactionId: 'tx-1',
  qrCodeBase64: 'base64',
  qrCodeString: 'string',
  amount: 100,
  status: 'PENDING',
  created_at: new Date(),
  updated_at: new Date(),
  orderId: 1,
};

describe('PaymentUseCasesImpl', () => {
  let useCases: PaymentUseCasesImpl;
  let paymentRepository: any;
  let orderUseCases: any;

  beforeEach(async () => {
    paymentRepository = {
      createPayment: jest.fn(),
      getPaymentStatus: jest.fn(),
      cancelPayment: jest.fn(),
    };
    orderUseCases = {
      findById: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentUseCasesImpl,
        { provide: TOKENS.PAYMENT_REPOSITORY, useValue: paymentRepository },
        { provide: TOKENS.ORDER_REPOSITORY, useValue: orderUseCases },
      ],
    }).compile();
    useCases = module.get(PaymentUseCasesImpl);
    jest.clearAllMocks();
  });

  describe('createPayment', () => {
    it('should create payment if order is valid and pending', async () => {
      orderUseCases.findById.mockResolvedValue(mockOrder);
      paymentRepository.createPayment.mockResolvedValue(mockPaymentResponse);
      const data = { amount: 100, description: 'desc', orderId: 1 };
      const result = await useCases.createPayment(data);
      expect(result).toEqual(mockPaymentResponse);
      expect(orderUseCases.findById).toHaveBeenCalledWith(1);
      expect(paymentRepository.createPayment).toHaveBeenCalledWith(
        data,
        mockOrder,
      );
    });

    it('should throw if orderId is missing', async () => {
      await expect(
        useCases.createPayment({ amount: 100, description: 'desc' }),
      ).rejects.toThrow(AppError);
    });

    it('should throw if order not found', async () => {
      orderUseCases.findById.mockResolvedValue(null);
      await expect(
        useCases.createPayment({
          amount: 100,
          description: 'desc',
          orderId: 2,
        }),
      ).rejects.toThrow(AppError);
    });

    it('should throw if order status is not PENDING', async () => {
      orderUseCases.findById.mockResolvedValue({
        ...mockOrder,
        status: OrderStatus.PAID,
      });
      await expect(
        useCases.createPayment({
          amount: 100,
          description: 'desc',
          orderId: 1,
        }),
      ).rejects.toThrow(AppError);
    });
  });

  describe('getPaymentStatus', () => {
    it('should return payment status', async () => {
      paymentRepository.getPaymentStatus.mockResolvedValue(mockPaymentResponse);
      const result = await useCases.getPaymentStatus('tx-1');
      expect(result).toEqual(mockPaymentResponse);
      expect(paymentRepository.getPaymentStatus).toHaveBeenCalledWith('tx-1');
    });
  });

  describe('cancelPayment', () => {
    it('should cancel payment', async () => {
      paymentRepository.cancelPayment.mockResolvedValue(undefined);
      await expect(useCases.cancelPayment('tx-1')).resolves.toBeUndefined();
      expect(paymentRepository.cancelPayment).toHaveBeenCalledWith('tx-1');
    });
  });
});
