/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { ClientUseCasesImpl } from './clients.use-cases';
import { ClientsRepositoryInterface } from '../../ports/output/repositories/clients/clients.repository.interface';
import { TOKENS } from '../../constants/injection.tokens';
import { AppError } from 'src/core/domain/errors/app.error';
import { ClientEntity } from 'src/core/domain/entities/clients/clients.entity';

const mockClient: ClientEntity = {
  id: 1,
  name: 'Test User',
  email: 'test@example.com',
  document: '12345678900',
  created_at: new Date(),
};

describe('ClientUseCasesImpl', () => {
  let useCases: ClientUseCasesImpl;
  let repository: jest.Mocked<ClientsRepositoryInterface>;

  beforeEach(async () => {
    const repoMock: jest.Mocked<ClientsRepositoryInterface> = {
      create: jest.fn(),
      identityClient: jest.fn(),
      findClientByEmailOrDocument: jest.fn(),
      findById: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClientUseCasesImpl,
        { provide: TOKENS.CLIENTS_REPOSITORY, useValue: repoMock },
      ],
    }).compile();
    useCases = module.get(ClientUseCasesImpl);
    repository = module.get(TOKENS.CLIENTS_REPOSITORY);
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new client if not exists', async () => {
      repository.findClientByEmailOrDocument.mockResolvedValue(null);
      repository.create.mockResolvedValue(mockClient);
      const data = {
        name: 'Test User',
        email: 'test@example.com',
        document: '12345678900',
      };
      const result = await useCases.create(data);
      expect(result).toEqual(mockClient);
      expect(repository.findClientByEmailOrDocument).toHaveBeenCalledWith({
        document: data.document,
        email: data.email,
      });
      expect(repository.create).toHaveBeenCalledWith(data);
    });
    it('should throw conflict if client already exists', async () => {
      repository.findClientByEmailOrDocument.mockResolvedValue(mockClient);
      const data = {
        name: 'Test User',
        email: 'test@example.com',
        document: '12345678900',
      };
      await expect(useCases.create(data)).rejects.toThrow(AppError);
    });
  });

  describe('identityClient', () => {
    it('should return client if found', async () => {
      repository.identityClient.mockResolvedValue(mockClient);
      const data = { document: '12345678900', email: 'test@example.com' };
      const result = await useCases.identityClient(data);
      expect(result).toEqual(mockClient);
      expect(repository.identityClient).toHaveBeenCalledWith(data);
    });
    it('should throw not found if client does not exist', async () => {
      repository.identityClient.mockResolvedValue(null);
      const data = { document: 'notfound', email: 'notfound@example.com' };
      await expect(useCases.identityClient(data)).rejects.toThrow(AppError);
    });
  });

  describe('findById', () => {
    it('should return client by id', async () => {
      repository.findById.mockResolvedValue(mockClient);
      const result = await useCases.findById(1);
      expect(result).toEqual(mockClient);
      expect(repository.findById).toHaveBeenCalledWith(1);
    });
    it('should throw not found if client does not exist', async () => {
      repository.findById.mockResolvedValue(null);
      await expect(useCases.findById(2)).rejects.toThrow(AppError);
    });
  });
});
