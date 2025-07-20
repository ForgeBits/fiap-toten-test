/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Test, TestingModule } from '@nestjs/testing';
import { CollaboratorUseCasesImpl } from './collaborators.use-cases';
import { CollaboratorRepositoryInterface } from '../../ports/output/repositories/collaborators/collaborators.repository.interface';
import { EncryptionServiceInterface } from '../../ports/output/services/encryption/encryption.service.interface';
import { TOKENS } from '../../constants/injection.tokens';
import { AppError } from '../../../domain/errors/app.error';
import { CollaboratorEntity } from '../../../domain/entities/collaborators/collaborator.entity';
import {
  CollaboratorsCreateInterface,
  CollaboratorsQueryFiltersInterface,
} from '../../../domain/dtos/collaborators/collaborators.db.interface';
import { PaginatedResult } from '../../../domain/dtos/common/pagination.query.db.interface';

const mockCollaborator: CollaboratorEntity = {
  id: 1,
  name: 'Test User',
  email: 'test@example.com',
  phone: '123456789',
  document: '12345678900',
  photo: null,
  type: 1 as any,
  status: 1 as any,
  password: 'hashed',
  created_at: new Date(),
  updated_at: new Date(),
};

describe('CollaboratorUseCasesImpl', () => {
  let useCases: CollaboratorUseCasesImpl;
  let repository: jest.Mocked<CollaboratorRepositoryInterface>;
  let encryptionService: jest.Mocked<EncryptionServiceInterface>;

  beforeEach(async () => {
    const repoMock: jest.Mocked<CollaboratorRepositoryInterface> = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findByEmail: jest.fn(),
      findByDocument: jest.fn(),
      findByEmailOrDocument: jest.fn(),
    };
    const encryptionMock: jest.Mocked<EncryptionServiceInterface> = {
      hash: jest.fn(),
      compare: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CollaboratorUseCasesImpl,
        { provide: TOKENS.COLLABORATOR_REPOSITORY, useValue: repoMock },
        { provide: TOKENS.ENCRYPTION_SERVICE, useValue: encryptionMock },
      ],
    }).compile();
    useCases = module.get(CollaboratorUseCasesImpl);
    repository = module.get(TOKENS.COLLABORATOR_REPOSITORY);
    encryptionService = module.get(TOKENS.ENCRYPTION_SERVICE);
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return paginated collaborators', async () => {
      const paginated: PaginatedResult<CollaboratorEntity> = {
        data: [mockCollaborator],
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
      const filters: CollaboratorsQueryFiltersInterface = {
        page: 1,
        limit: 10,
      };
      const result = await useCases.findAll(filters);
      expect(result).toEqual(paginated);
      expect(repository.findAll).toHaveBeenCalledWith(filters);
    });
  });

  describe('findById', () => {
    it('should return a collaborator by id', async () => {
      repository.findById.mockResolvedValue(mockCollaborator);
      const result = await useCases.findById(1);
      expect(result).toEqual(mockCollaborator);
    });
    it('should throw not found if collaborator does not exist', async () => {
      repository.findById.mockResolvedValue(null);
      await expect(useCases.findById(2)).rejects.toThrow(AppError);
    });
  });

  describe('create', () => {
    it('should create a new collaborator', async () => {
      repository.findByEmailOrDocument.mockResolvedValue(null);
      encryptionService.hash.mockResolvedValue('hashedPassword');
      repository.create.mockResolvedValue({
        ...mockCollaborator,
        password: 'hashedPassword',
      });
      const data: CollaboratorsCreateInterface = {
        name: 'Test User',
        email: 'test@example.com',
        phone: '123456789',
        document: '12345678900',
        photo: undefined,
        type: 1 as any,
        status: 1 as any,
        password: 'plain',
      };
      const result = await useCases.create(data);
      expect(result.password).toBe('hashedPassword');
      expect(repository.create).toHaveBeenCalledWith({
        ...data,
        password: 'hashedPassword',
      });
    });
    it('should throw conflict if email or document exists', async () => {
      repository.findByEmailOrDocument.mockResolvedValue(mockCollaborator);
      const data: CollaboratorsCreateInterface = {
        name: 'Test User',
        email: 'test@example.com',
        phone: '123456789',
        document: '12345678900',
        photo: undefined,
        type: 1 as any,
        status: 1 as any,
        password: 'plain',
      };
      await expect(useCases.create(data)).rejects.toThrow(AppError);
    });
  });

  describe('update', () => {
    it('should update a collaborator', async () => {
      repository.findById.mockResolvedValue(mockCollaborator);
      repository.update.mockResolvedValue({
        ...mockCollaborator,
        name: 'Updated',
      });
      const result = await useCases.update(1, { name: 'Updated' });
      expect(result.name).toBe('Updated');
      expect(repository.update).toHaveBeenCalledWith(1, { name: 'Updated' });
    });
    it('should throw not found if collaborator does not exist', async () => {
      repository.findById.mockResolvedValue(null);
      await expect(useCases.update(2, { name: 'Updated' })).rejects.toThrow(
        AppError,
      );
    });
  });

  describe('delete', () => {
    it('should delete a collaborator', async () => {
      repository.findById.mockResolvedValue(mockCollaborator);
      repository.delete.mockResolvedValue();
      await expect(useCases.delete(1)).resolves.toBeUndefined();
      expect(repository.delete).toHaveBeenCalledWith(1);
    });
    it('should throw not found if collaborator does not exist', async () => {
      repository.findById.mockResolvedValue(null);
      await expect(useCases.delete(2)).rejects.toThrow(AppError);
    });
  });
});
