import {
  AuthenticationBodyInterface,
  AuthenticationRefreshTokenBodyInterface,
  AuthenticationResponse,
  AuthenticationResponseInterface,
} from 'src/core/domain/dtos/authentication/authentication.db.interface';

export interface AuthenticationUseCases {
  login(data: AuthenticationBodyInterface): Promise<AuthenticationResponse>;
  validateToken(token: string): Promise<boolean>;
  refreshToken(
    data: AuthenticationRefreshTokenBodyInterface,
  ): Promise<AuthenticationResponseInterface>;
}
