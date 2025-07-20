/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Test, TestingModule } from '@nestjs/testing';
import { OrderUseCasesImpl } from './orders.use-cases';
import { TOKENS } from '../../constants/injection.tokens';
import { OrderStatus } from '../../../domain/entities/orders/orders.entity';
import { AppError } from '../../../domain/errors/app.error';

const mockOrder = {
  id: 1,
  clientId: 1,
  status: OrderStatus.PENDING,
  establishmentId: 1,
  amount: 100,
  transactionId: 'tx-1',
  observation: null,
  items: [
    {
      id: 1,
      productId: 1,
      title: 'Produto Teste',
      description: 'Descrição do produto',
      photo: null,
      unitPrice: 50,
      quantity: 2,
      price: 100,
      orderId: 1,
      observation: null,
      customerItems: [],
    },
  ],
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockOrderCreate = {
  clientId: 1,
  status: OrderStatus.PENDING,
  establishmentId: 1,
  isRandomClient: true,
  codeClientRandom: undefined,
  amount: 100,
  transactionId: 'tx-1',
  items: [
    {
      productId: 1,
      title: 'Produto Teste',
      description: 'Descrição do produto',
      photo: null,
      unitPrice: 50,
      quantity: 2,
      price: 100,
      observation: null,
      customerItems: [],
    },
  ],
};

const paginatedMock = {
  data: [mockOrder],
  meta: {
    page: 1,
    limit: 10,
    total: 1,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  },
};

describe('OrderUseCasesImpl', () => {
  let useCases: OrderUseCasesImpl;
  let repository: any;
  let clientUseCase: any;
  let paymentUseCases: any;
  let productUseCases: any;

  beforeEach(async () => {
    repository = {
      findAll: jest.fn(),
      findById: jest.fn(),
      findByTransactionId: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      updateStatus: jest.fn(),
      delete: jest.fn(),
      findAllReadyToPrepare: jest.fn(),
      findAllReadyToDeliver: jest.fn(),
      initiatePreparation: jest.fn(),
      finishPreparation: jest.fn(),
    };
    clientUseCase = {
      create: jest.fn(),
      identityClient: jest.fn(),
      findById: jest.fn(),
    };
    paymentUseCases = {
      createPayment: jest.fn(),
      getPaymentStatus: jest.fn(),
      cancelPayment: jest.fn(),
    };
    productUseCases = {
      findAll: jest.fn(),
      findById: jest.fn(),
      findProductsByIds: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findByName: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderUseCasesImpl,
        { provide: TOKENS.ORDER_REPOSITORY, useValue: repository },
        { provide: TOKENS.CLIENTS_USE_CASES, useValue: clientUseCase },
        { provide: TOKENS.PAYMENT_USE_CASES, useValue: paymentUseCases },
        { provide: TOKENS.PRODUCTS_USE_CASES, useValue: productUseCases },
      ],
    }).compile();
    useCases = module.get(OrderUseCasesImpl);
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return paginated orders', async () => {
      repository.findAll.mockResolvedValue(paginatedMock);
      const result = await useCases.findAll({ page: 1, limit: 10 });
      expect(result).toEqual(paginatedMock);
      expect(repository.findAll).toHaveBeenCalledWith({ page: 1, limit: 10 });
    });
  });

  describe('findById', () => {
    it('should return an order by id', async () => {
      repository.findById.mockResolvedValue(mockOrder);
      const result = await useCases.findById(1);
      expect(result).toEqual(mockOrder);
    });
    it('should throw not found if order does not exist', async () => {
      repository.findById.mockResolvedValue(null);
      await expect(useCases.findById(2)).rejects.toThrow(AppError);
    });
  });

  describe('create', () => {
    it('should create a new order if transactionId is unique', async () => {
      repository.create.mockResolvedValue(mockOrder);
      productUseCases.findProductsByIds.mockResolvedValue(
        mockOrderCreate.items.map((item) => ({ ...item })),
      );
      repository.findByTransactionId.mockResolvedValue(null);
      paymentUseCases.createPayment.mockResolvedValue({
        transactionId: 'tx-1',
        amount: 100,
        orderId: 1,
        status: OrderStatus.PAID,
      });
      repository.updateStatusWithTransactionId = jest.fn().mockResolvedValue({
        ...mockOrder,
        status: OrderStatus.PAID,
      });
      const data = { ...mockOrderCreate };
      const result = await useCases.create(data);
      expect(result).toEqual({
        ...mockOrder,
        status: OrderStatus.PAID,
        payment: {
          transactionId: 'tx-1',
          amount: 100,
          orderId: 1,
          status: OrderStatus.PAID,
        },
      });
      expect(repository.create).toHaveBeenCalled();
    });
    it('should throw conflict if transactionId exists', async () => {
      repository.findByTransactionId.mockResolvedValue(mockOrder);
      await expect(
        useCases.create({ ...mockOrderCreate, isRandomClient: false }),
      ).rejects.toThrow(AppError);
    });
  });

  describe('update', () => {
    it('should update an order if exists', async () => {
      repository.findById.mockResolvedValue(mockOrder);
      repository.update.mockResolvedValue({
        ...mockOrder,
        status: OrderStatus.PAID,
      });
      const result = await useCases.update(1, { status: OrderStatus.PAID });
      expect(result.status).toBe(OrderStatus.PAID);
      expect(repository.update).toHaveBeenCalledWith(1, {
        status: OrderStatus.PAID,
      });
    });
    it('should throw not found if order does not exist', async () => {
      repository.findById.mockResolvedValue(null);
      await expect(
        useCases.update(2, { status: OrderStatus.PAID }),
      ).rejects.toThrow(AppError);
    });
  });

  describe('delete', () => {
    it('should delete an order if exists', async () => {
      repository.findById.mockResolvedValue(mockOrder);
      repository.delete.mockResolvedValue(undefined);
      await expect(useCases.delete(1)).resolves.toBeUndefined();
      expect(repository.delete).toHaveBeenCalledWith(1);
    });
    it('should throw not found if order does not exist', async () => {
      repository.findById.mockResolvedValue(null);
      await expect(useCases.delete(2)).rejects.toThrow(AppError);
    });
  });

  describe('updateStatus', () => {
    it('should update status if order exists', async () => {
      repository.findById.mockResolvedValue(mockOrder);
      repository.updateStatus.mockResolvedValue(undefined);
      await expect(
        useCases.updateStatus(1, OrderStatus.PAID),
      ).resolves.toBeUndefined();
      expect(repository.updateStatus).toHaveBeenCalledWith(1, OrderStatus.PAID);
    });
    it('should throw not found if order does not exist', async () => {
      repository.findById.mockResolvedValue(null);
      await expect(useCases.updateStatus(2, OrderStatus.PAID)).rejects.toThrow(
        AppError,
      );
    });
  });

  describe('findAllReadyToPrepare', () => {
    it('should return paginated orders ready to prepare', async () => {
      repository.findAllReadyToPrepare.mockResolvedValue(paginatedMock);
      const result = await useCases.findAllReadyToPrepare({
        page: 1,
        limit: 10,
      });
      expect(result).toEqual(paginatedMock);
      expect(repository.findAllReadyToPrepare).toHaveBeenCalledWith({
        page: 1,
        limit: 10,
      });
    });
  });
});
