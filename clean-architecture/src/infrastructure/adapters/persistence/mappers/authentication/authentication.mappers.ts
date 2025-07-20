import { AuthenticationResponse } from 'src/core/domain/dtos/authentication/authentication.db.interface';

export class AuthenticationMapper {
  static mappedAuthenticationToDomain(
    data: AuthenticationResponse,
  ): AuthenticationResponse {
    return {
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      ...(!!data.user && {
        user: {
          id: data.user?.id,
          name: data.user?.name,
          email: data.user?.email,
        },
      }),
    };
  }
}
