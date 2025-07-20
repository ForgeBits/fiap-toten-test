import { Injectable, Inject } from '@nestjs/common';
import { AuthenticationUseCases } from '../../ports/input/auth/authentication.use-case.port';
import { EncryptionServiceInterface } from '../../ports/output/services/encryption/encryption.service.interface';
import { AuthenticationServiceInterface } from '../../ports/output/services/authentication/authentication.service.interface';
import { AppError } from '../../../domain/errors/app.error';
import { handleServiceError } from '../../../../infrastructure/shared/utils/error.handler.util';
import {
  AuthenticationBodyInterface,
  AuthenticationRefreshTokenBodyInterface,
  AuthenticationResponse,
  AuthenticationResponseInterface,
} from 'src/core/domain/dtos/authentication/authentication.db.interface';
import { CollaboratorRepositoryInterface } from '../../ports/output/repositories/collaborators/collaborators.repository.interface';
import { TOKENS } from '../../constants/injection.tokens';

@Injectable()
export class AuthenticationUseCasesImpl implements AuthenticationUseCases {
  constructor(
    @Inject(TOKENS.COLLABORATOR_REPOSITORY)
    private readonly collaboratorRepository: CollaboratorRepositoryInterface,
    @Inject(TOKENS.ENCRYPTION_SERVICE)
    private readonly encryptionService: EncryptionServiceInterface,
    @Inject(TOKENS.AUTHENTICATION_SERVICE)
    private readonly authService: AuthenticationServiceInterface,
  ) {}

  async login({
    document,
    password,
  }: AuthenticationBodyInterface): Promise<AuthenticationResponse> {
    try {
      const collaborator =
        await this.collaboratorRepository.findByDocument(document);

      if (!collaborator) {
        throw AppError.unauthorized({
          message: 'Invalid credentials',
        });
      }

      const isPasswordValid = await this.encryptionService.compare(
        password,
        collaborator.password ?? '',
      );

      if (!isPasswordValid) {
        throw AppError.unauthorized({
          message: 'Invalid credentials',
        });
      }

      // Gerar tokens
      const authResult = this.authService.login({
        id: collaborator.id,
        email: collaborator.email,
        name: collaborator.name,
      });

      return authResult;
    } catch (error) {
      handleServiceError(error, 'AuthenticationUseCases.login');
    }
  }

  async validateToken(token: string): Promise<boolean> {
    try {
      return await this.authService.verify(token);
    } catch (error) {
      handleServiceError(error, 'AuthenticationUseCases.validateToken');
      return false;
    }
  }

  async refreshToken({
    refreshToken,
  }: AuthenticationRefreshTokenBodyInterface): Promise<AuthenticationResponseInterface> {
    try {
      const payload = await this.authService.verifyRefreshToken(refreshToken);

      if (!payload) {
        throw AppError.unauthorized({
          message: 'Invalid refresh token',
        });
      }

      const userId = payload.user?.id;
      if (!userId) {
        throw AppError.unauthorized({
          message: 'Invalid refresh token',
        });
      }

      const collaborator = await this.collaboratorRepository.findById(userId);

      return this.authService.login({
        id: collaborator?.id,
        email: collaborator?.email,
        name: collaborator?.name,
      });
    } catch (error) {
      handleServiceError(error, 'AuthenticationUseCases.refreshToken');
    }
  }
}
