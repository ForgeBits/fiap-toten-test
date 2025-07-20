import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { TOKENS } from 'src/core/application/constants/injection.tokens';
import { AuthenticationRepositoryInterface } from 'src/core/application/ports/output/repositories/authentication/authentication.repository.interface';
import { AuthenticationServiceInterface } from 'src/core/application/ports/output/services/authentication/authentication.service.interface';
import { EncryptionServiceInterface } from 'src/core/application/ports/output/services/encryption/encryption.service.interface';
import {
  AuthenticationBodyInterface,
  AuthenticationRefreshTokenBodyInterface,
  AuthenticationResponse,
} from 'src/core/domain/dtos/authentication/authentication.db.interface';
import { AuthenticationMapper } from 'src/infrastructure/adapters/persistence/mappers/authentication/authentication.mappers';
import { PrismaService } from 'src/infrastructure/config/database/prisma/prisma.service';

@Injectable()
export class AuthenticationRepositoryService
  implements AuthenticationRepositoryInterface
{
  constructor(
    @Inject(TOKENS.ENCRYPTION_SERVICE)
    private readonly encryptionService: EncryptionServiceInterface,
    @Inject(TOKENS.AUTHENTICATION_SERVICE)
    private readonly authenticationService: AuthenticationServiceInterface,
    private readonly prismaService: PrismaService,
  ) {}

  async login({
    document,
    password,
  }: AuthenticationBodyInterface): Promise<AuthenticationResponse> {
    const user = await this.prismaService.collaborators.findUnique({
      where: { document },
    });

    const isValid = await this.encryptionService.compare(
      password,
      user?.password ?? '',
    );

    if (!isValid || !user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const userPayload = {
      id: user.id,
      email: user.email,
    };

    const { accessToken, refreshToken } =
      this.authenticationService.login(userPayload);

    return AuthenticationMapper.mappedAuthenticationToDomain({
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        document: user.document,
        phone: user.phone,
      },
    });
  }

  async refreshToken({
    refreshToken: refreshTokenBody,
  }: AuthenticationRefreshTokenBodyInterface): Promise<AuthenticationResponse> {
    const tokenVerified =
      await this.authenticationService.verifyRefreshToken(refreshTokenBody);

    if (!tokenVerified) {
      throw new UnauthorizedException('Invalid token');
    }

    const { accessToken: newAccessToken, refreshToken } =
      this.authenticationService.login({
        id: tokenVerified.user?.id,
        email: tokenVerified.user?.email,
      });

    return AuthenticationMapper.mappedAuthenticationToDomain({
      accessToken: newAccessToken,
      refreshToken,
    });
  }
}
