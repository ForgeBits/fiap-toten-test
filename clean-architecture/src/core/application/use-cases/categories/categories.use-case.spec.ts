/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { CategoryUseCasesImpl } from './categories.use-case';
import { CategoriesRepositoryInterface } from '../../ports/output/repositories/categories/categories.repository.interface';
import { AppError } from '../../../domain/errors/app.error';
import { TOKENS } from '../../constants/injection.tokens';
import {
  CategoriesInterface,
  CategoryCreateInterface,
} from 'src/core/domain/dtos/categories/categories.db.interface';

describe('CategoryUseCasesImpl', () => {
  let useCase: CategoryUseCasesImpl;
  let repository: jest.Mocked<CategoriesRepositoryInterface>;

  const category: CategoriesInterface = {
    id: 1,
    name: 'Test',
    description: 'desc',
    created_at: new Date(),
    updated_at: new Date(),
  };

  beforeEach(async () => {
    const repoMock: Partial<jest.Mocked<CategoriesRepositoryInterface>> = {
      findAll: jest.fn(),
      findById: jest.fn(),
      findByName: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoryUseCasesImpl,
        {
          provide: TOKENS.CATEGORIES_REPOSITORY,
          useValue: repoMock,
        },
      ],
    }).compile();
    useCase = module.get(CategoryUseCasesImpl);
    repository = module.get(TOKENS.CATEGORIES_REPOSITORY);
  });

  describe('findAll', () => {
    it('should return all categories', async () => {
      repository.findAll.mockResolvedValue([category]);
      const result = await useCase.findAll();
      expect(result).toEqual([category]);
      expect(repository.findAll).toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    it('should return a category by id', async () => {
      repository.findById.mockResolvedValue(category);
      const result = await useCase.findById(1);
      expect(result).toEqual(category);
    });
    it('should throw not found if category does not exist', async () => {
      repository.findById.mockResolvedValue(null);
      await expect(useCase.findById(2)).rejects.toThrow(AppError);
    });
  });

  describe('create', () => {
    it('should create a new category', async () => {
      repository.findByName.mockResolvedValue(null);
      repository.create.mockResolvedValue(category);
      const data: CategoryCreateInterface = { name: 'Test' };
      const result = await useCase.create(data);
      expect(result).toEqual(category);
      expect(repository.create).toHaveBeenCalledWith(data);
    });
    it('should throw conflict if name exists', async () => {
      repository.findByName.mockResolvedValue(category);
      await expect(useCase.create({ name: 'Test' })).rejects.toThrow(AppError);
    });
  });

  describe('update', () => {
    it('should update a category', async () => {
      repository.findById.mockResolvedValue(category);
      repository.findByName.mockResolvedValue(null);
      repository.update.mockResolvedValue({ ...category, name: 'Updated' });
      const result = await useCase.update(1, { name: 'Updated' });
      expect(result.name).toBe('Updated');
    });
    it('should throw not found if category does not exist', async () => {
      repository.findById.mockResolvedValue(null);
      await expect(useCase.update(2, { name: 'X' })).rejects.toThrow(AppError);
    });
    it('should throw conflict if name is taken by another', async () => {
      repository.findById.mockResolvedValue(category);
      repository.findByName.mockResolvedValue({ ...category, id: 2 });
      await expect(useCase.update(1, { name: 'Other' })).rejects.toThrow(
        AppError,
      );
    });
  });

  describe('delete', () => {
    it('should delete a category', async () => {
      repository.findById.mockResolvedValue(category);
      repository.delete.mockResolvedValue();
      await expect(useCase.delete(1)).resolves.toBeUndefined();
      expect(repository.delete).toHaveBeenCalledWith(1);
    });
    it('should throw not found if category does not exist', async () => {
      repository.findById.mockResolvedValue(null);
      await expect(useCase.delete(2)).rejects.toThrow(AppError);
    });
  });

  describe('findByName', () => {
    it('should return a category by name', async () => {
      repository.findByName.mockResolvedValue(category);
      const result = await useCase.findByName('Test');
      expect(result).toEqual(category);
    });
    it('should throw not found if category does not exist', async () => {
      repository.findByName.mockResolvedValue(null);
      await expect(useCase.findByName('X')).rejects.toThrow(AppError);
    });
  });
});
