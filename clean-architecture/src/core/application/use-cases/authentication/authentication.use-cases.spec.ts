import { Test, TestingModule } from '@nestjs/testing';
import { AuthenticationUseCasesImpl } from './authentication.use-cases';
import { TOKENS } from '../../constants/injection.tokens';
import { AppError } from '../../../domain/errors/app.error';

const mockCollaborator = {
  id: 1,
  email: 'test@example.com',
  name: 'Test User',
  password: 'hashedPassword',
};

const mockAuthResponse = {
  accessToken: 'access-token',
  refreshToken: 'refresh-token',
  user: { id: 1, email: 'test@example.com', name: 'Test User' },
};

const collaboratorRepositoryMock = {
  findByDocument: jest.fn(),
  findById: jest.fn(),
};

const encryptionServiceMock = {
  compare: jest.fn(),
};

const authServiceMock = {
  login: jest.fn(),
  verify: jest.fn(),
  verifyRefreshToken: jest.fn(),
};

describe('AuthenticationUseCasesImpl', () => {
  let useCases: AuthenticationUseCasesImpl;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthenticationUseCasesImpl,
        {
          provide: TOKENS.COLLABORATOR_REPOSITORY,
          useValue: collaboratorRepositoryMock,
        },
        { provide: TOKENS.ENCRYPTION_SERVICE, useValue: encryptionServiceMock },
        { provide: TOKENS.AUTHENTICATION_SERVICE, useValue: authServiceMock },
      ],
    }).compile();

    useCases = module.get(AuthenticationUseCasesImpl);
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should login successfully with valid credentials', async () => {
      collaboratorRepositoryMock.findByDocument.mockResolvedValue(
        mockCollaborator,
      );
      encryptionServiceMock.compare.mockResolvedValue(true);
      authServiceMock.login.mockReturnValue(mockAuthResponse);

      const result = await useCases.login({
        document: '123',
        password: 'pass',
      });
      expect(result).toEqual(mockAuthResponse);
      expect(collaboratorRepositoryMock.findByDocument).toHaveBeenCalledWith(
        '123',
      );
      expect(encryptionServiceMock.compare).toHaveBeenCalledWith(
        'pass',
        'hashedPassword',
      );
      expect(authServiceMock.login).toHaveBeenCalledWith({
        id: mockCollaborator.id,
        email: mockCollaborator.email,
        name: mockCollaborator.name,
      });
    });

    it('should throw unauthorized if collaborator not found', async () => {
      collaboratorRepositoryMock.findByDocument.mockResolvedValue(null);
      await expect(
        useCases.login({ document: 'notfound', password: 'pass' }),
      ).rejects.toThrow(AppError);
    });

    it('should throw unauthorized if password is invalid', async () => {
      collaboratorRepositoryMock.findByDocument.mockResolvedValue(
        mockCollaborator,
      );
      encryptionServiceMock.compare.mockResolvedValue(false);
      await expect(
        useCases.login({ document: '123', password: 'wrong' }),
      ).rejects.toThrow(AppError);
    });
  });

  describe('validateToken', () => {
    it('should return true for valid token', async () => {
      authServiceMock.verify.mockResolvedValue(true);
      const result = await useCases.validateToken('valid-token');
      expect(result).toBe(true);
      expect(authServiceMock.verify).toHaveBeenCalledWith('valid-token');
    });
  });

  describe('refreshToken', () => {
    it('should refresh token successfully', async () => {
      authServiceMock.verifyRefreshToken.mockResolvedValue({ user: { id: 1 } });
      collaboratorRepositoryMock.findById.mockResolvedValue(mockCollaborator);
      authServiceMock.login.mockReturnValue(mockAuthResponse);

      const result = await useCases.refreshToken({
        refreshToken: 'refresh',
        accessToken: 'access',
      });
      expect(result).toEqual(mockAuthResponse);
      expect(authServiceMock.verifyRefreshToken).toHaveBeenCalledWith(
        'refresh',
      );
      expect(collaboratorRepositoryMock.findById).toHaveBeenCalledWith(1);
      expect(authServiceMock.login).toHaveBeenCalled();
    });

    it('should throw unauthorized if refresh token is invalid', async () => {
      authServiceMock.verifyRefreshToken.mockResolvedValue(null);
      await expect(
        useCases.refreshToken({
          refreshToken: 'invalid',
          accessToken: 'access',
        }),
      ).rejects.toThrow(AppError);
    });

    it('should throw unauthorized if user id is missing in payload', async () => {
      authServiceMock.verifyRefreshToken.mockResolvedValue({ user: {} });
      await expect(
        useCases.refreshToken({
          refreshToken: 'invalid',
          accessToken: 'access',
        }),
      ).rejects.toThrow(AppError);
    });
  });
});
