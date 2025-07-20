import {
  AuthenticationBodyInterface,
  AuthenticationRefreshTokenBodyInterface,
  AuthenticationResponse,
} from 'src/core/domain/dtos/authentication/authentication.db.interface';

export interface AuthenticationRepositoryInterface {
  login(auth: AuthenticationBodyInterface): Promise<AuthenticationResponse>;
  refreshToken(
    token: AuthenticationRefreshTokenBodyInterface,
  ): Promise<AuthenticationResponse>;
}
