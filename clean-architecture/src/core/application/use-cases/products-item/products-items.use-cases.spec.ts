/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { ProductItemsUseCasesImpl } from './products-items.use-cases';
import { TOKENS } from '../../constants/injection.tokens';
import { ProductsItemRepositoryInterface } from '../../ports/output/repositories/products-item/products-item.repository.interface';
import { ProductsItemsResponseInterface } from 'src/core/domain/dtos/products-item/products-items.dto';
import { UpdateProductItemDto } from 'src/drivers/aplication/dtos/product-items/update-product-item.dto';

const mockProductItem: ProductsItemsResponseInterface = {
  id: 1,
  name: 'Item 1',
  created_at: new Date(),
  updated_at: new Date(),
  description: 'desc',
  amount: 10,
  quantity: 5,
  isActive: true,
};

describe('ProductItemsUseCasesImpl', () => {
  let useCases: ProductItemsUseCasesImpl;
  let repository: jest.Mocked<ProductsItemRepositoryInterface>;

  beforeEach(async () => {
    const repoMock: jest.Mocked<ProductsItemRepositoryInterface> = {
      registerItem: jest.fn(),
      getAllItems: jest.fn(),
      updateItem: jest.fn(),
      deleteItem: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductItemsUseCasesImpl,
        {
          provide: TOKENS.PRODUCTS_ITEM_REPOSITORY,
          useValue: repoMock,
        },
      ],
    }).compile();
    useCases = module.get(ProductItemsUseCasesImpl);
    repository = module.get(TOKENS.PRODUCTS_ITEM_REPOSITORY);
    jest.clearAllMocks();
  });

  describe('registerItem', () => {
    it('should register a product item', async () => {
      repository.registerItem.mockResolvedValue(mockProductItem);
      const result = await useCases.registerItem({ ...mockProductItem });
      expect(result).toEqual(mockProductItem);
      expect(repository.registerItem).toHaveBeenCalledWith({
        ...mockProductItem,
      });
    });
  });

  describe('getAllItems', () => {
    it('should return all product items', async () => {
      repository.getAllItems.mockResolvedValue([mockProductItem]);
      const result = await useCases.getAllItems();
      expect(result).toEqual([mockProductItem]);
      expect(repository.getAllItems).toHaveBeenCalled();
    });
  });

  describe('updateItem', () => {
    it('should update a product item', async () => {
      const updateDto: UpdateProductItemDto = { name: 'Updated' } as any;
      repository.updateItem.mockResolvedValue({
        ...mockProductItem,
        ...updateDto,
      });
      const result = await useCases.updateItem(1, updateDto);
      expect(result).toEqual({ ...mockProductItem, ...updateDto });
      expect(repository.updateItem).toHaveBeenCalledWith(1, updateDto);
    });
  });

  describe('deleteItem', () => {
    it('should delete a product item', async () => {
      repository.deleteItem.mockResolvedValue(mockProductItem);
      const result = await useCases.deleteItem(1);
      expect(result).toEqual(mockProductItem);
      expect(repository.deleteItem).toHaveBeenCalledWith(1);
    });
  });
});
