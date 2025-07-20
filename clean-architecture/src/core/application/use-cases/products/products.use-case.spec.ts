/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Test, TestingModule } from '@nestjs/testing';
import { ProductsUseCasesImpl } from './products.use-case';
import { TOKENS } from '../../constants/injection.tokens';
import { AppError } from '../../../domain/errors/app.error';
import { Product } from '../../../domain/entities/products/product.entity';
import { PaginatedResponse } from 'src/infrastructure/adapters/persistence/mappers/common/pagination.mappers';

describe('ProductsUseCasesImpl', () => {
  let useCases: ProductsUseCasesImpl;
  let repository: any;
  let categoryUseCases: any;

  const mockProduct: Product = {
    id: 1,
    category: {
      id: 1,
      name: 'cat',
      description: '',
      created_at: new Date(),
      updated_at: new Date(),
    },
    name: 'Test',
    description: 'desc',
    amount: 10,
    url_img: 'img',
    customizable: false,
    available: true,
    created_at: new Date(),
    updated_at: new Date(),
  };

  beforeEach(async () => {
    repository = {
      findByName: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findProductsByIds: jest.fn(),
    };
    categoryUseCases = {
      findById: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsUseCasesImpl,
        { provide: TOKENS.PRODUCTS_REPOSITORY, useValue: repository },
        { provide: TOKENS.CATEGORY_USE_CASES, useValue: categoryUseCases },
      ],
    }).compile();
    useCases = module.get(ProductsUseCasesImpl);
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a product if name is unique and category exists', async () => {
      repository.findByName.mockResolvedValue(null);
      categoryUseCases.findById.mockResolvedValue({ id: 1 });
      repository.create.mockResolvedValue(mockProduct);
      const data = { ...mockProduct, category: 1, productItems: [] };
      const result = await useCases.create(data);
      expect(result).toEqual(mockProduct);
      expect(repository.create).toHaveBeenCalledWith(data);
    });
    it('should throw conflict if product name exists', async () => {
      repository.findByName.mockResolvedValue(mockProduct);
      await expect(
        useCases.create({ ...mockProduct, category: 1, productItems: [] }),
      ).rejects.toThrow(AppError);
    });
    it('should throw not found if category does not exist', async () => {
      repository.findByName.mockResolvedValue(null);
      categoryUseCases.findById.mockResolvedValue(null);
      await expect(
        useCases.create({ ...mockProduct, category: 1, productItems: [] }),
      ).rejects.toThrow(AppError);
    });
  });

  describe('findAll', () => {
    it('should return paginated products', async () => {
      const paginated: PaginatedResponse<Product> = {
        data: [mockProduct],
        meta: {
          page: 1,
          limit: 10,
          total: 1,
          totalPages: 1,
          hasNextPage: false,
          hasPrevPage: false,
        },
      };
      repository.findAll.mockResolvedValue(paginated);
      const result = await useCases.findAll({ page: 1, limit: 10 });
      expect(result).toEqual(paginated);
    });
  });

  describe('findById', () => {
    it('should return a product by id', async () => {
      repository.findById.mockResolvedValue(mockProduct);
      const result = await useCases.findById(1);
      expect(result).toEqual(mockProduct);
    });
    it('should throw not found if product does not exist', async () => {
      repository.findById.mockResolvedValue(null);
      await expect(useCases.findById(2)).rejects.toThrow(AppError);
    });
  });

  describe('update', () => {
    it('should update a product', async () => {
      repository.findById.mockResolvedValue(mockProduct);
      repository.update.mockResolvedValue({ ...mockProduct, name: 'Updated' });
      const result = await useCases.update(1, { name: 'Updated' });
      expect(result.name).toBe('Updated');
    });
    it('should throw not found if product does not exist', async () => {
      repository.findById.mockResolvedValue(null);
      await expect(useCases.update(2, { name: 'Updated' })).rejects.toThrow(
        AppError,
      );
    });
    it('should throw conflict if new name is taken', async () => {
      repository.findById.mockResolvedValue(mockProduct);
      repository.findByName.mockResolvedValue({ ...mockProduct, id: 2 });
      await expect(useCases.update(1, { name: 'Taken' })).rejects.toThrow(
        AppError,
      );
    });
  });

  describe('delete', () => {
    it('should delete a product', async () => {
      repository.findById.mockResolvedValue(mockProduct);
      repository.delete.mockResolvedValue(undefined);
      await expect(useCases.delete(1)).resolves.toBeUndefined();
    });
    it('should throw not found if product does not exist', async () => {
      repository.findById.mockResolvedValue(null);
      await expect(useCases.delete(2)).rejects.toThrow(AppError);
    });
  });

  describe('findByName', () => {
    it('should return a product by name', async () => {
      repository.findByName.mockResolvedValue(mockProduct);
      const result = await useCases.findByName('Test');
      expect(result).toEqual(mockProduct);
    });
    it('should throw not found if product does not exist', async () => {
      repository.findByName.mockResolvedValue(null);
      await expect(useCases.findByName('NotFound')).rejects.toThrow(AppError);
    });
  });

  describe('findProductsByIds', () => {
    it('should return products by ids', async () => {
      repository.findProductsByIds.mockResolvedValue([mockProduct]);
      const result = await useCases.findProductsByIds([1]);
      expect(result).toEqual([mockProduct]);
    });
    it('should throw not found if any id is missing', async () => {
      repository.findProductsByIds.mockResolvedValue([]);
      await expect(useCases.findProductsByIds([1])).rejects.toThrow(AppError);
    });
  });
});
