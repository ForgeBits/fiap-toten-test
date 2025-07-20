import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import { AuthenticationServiceInterface } from 'src/core/application/ports/output/services/authentication/authentication.service.interface';
import { AuthenticationResponseInterface } from 'src/core/domain/dtos/authentication/authentication.db.interface';
import { CollaboratorsInterface } from 'src/core/domain/dtos/collaborators/collaborators.db.interface';

@Injectable()
export class AuthenticationServiceProvider
  implements AuthenticationServiceInterface
{
  constructor(
    private readonly jwtService: NestJwtService,
    private readonly configService: ConfigService,
  ) {}

  login(loggedUser: CollaboratorsInterface): AuthenticationResponseInterface {
    const accessToken = this.jwtService.sign(loggedUser);
    const refreshToken = this.jwtService.sign(loggedUser, {
      secret: this.configService.get<string>('jwtRefreshSecret'),
      expiresIn: this.configService.get<string>('expirationTime'),
    });
    return { accessToken, refreshToken };
  }

  verify(token: string): any {
    const secret = this.configService.get<string>('jwtSecret');
    return this.jwtService.verify(token, {
      secret,
    });
  }

  verifyRefreshToken(
    token: string,
  ): Promise<Partial<AuthenticationResponseInterface>> {
    const secret = this.configService.get<string>('jwtRefreshSecret');
    const payload = this.jwtService.verify<Partial<CollaboratorsInterface>>(
      token,
      {
        secret,
      },
    );

    if (!payload) {
      throw new Error('Invalid refresh token');
    }

    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('jwtRefreshSecret'),
      expiresIn: this.configService.get<string>('expirationTime'),
    });

    return Promise.resolve({ accessToken, refreshToken });
  }
}
