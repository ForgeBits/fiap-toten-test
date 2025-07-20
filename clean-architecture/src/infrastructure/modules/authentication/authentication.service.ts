import { Inject, Injectable } from '@nestjs/common';
import { TOKENS } from 'src/core/application/constants/injection.tokens';
import { AuthenticationUseCases } from 'src/core/application/ports/input/auth/authentication.use-case.port';
import {
  AuthenticationDto,
  AuthenticationRefreshTokenDto,
} from 'src/drivers/aplication/dtos/authentication/authentication.dto';

@Injectable()
export class AuthenticationService {
  constructor(
    @Inject(TOKENS.AUTHENTICATION_USE_CASES)
    private readonly authenticationUseCase: AuthenticationUseCases,
  ) {}

  login(authenticationDto: AuthenticationDto) {
    return this.authenticationUseCase.login(authenticationDto);
  }

  refreshToken(authenticationRefreshDto: AuthenticationRefreshTokenDto) {
    return this.authenticationUseCase.refreshToken(authenticationRefreshDto);
  }
}
