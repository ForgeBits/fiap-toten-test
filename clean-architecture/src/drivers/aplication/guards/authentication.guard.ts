import { Request } from 'express';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Inject,
} from '@nestjs/common';
import { AuthenticationServiceInterface } from 'src/core/application/ports/output/services/authentication/authentication.service.interface';
import { TOKENS } from 'src/core/application/constants/injection.tokens';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(
    @Inject(TOKENS.AUTHENTICATION_SERVICE)
    private readonly authenticationService: AuthenticationServiceInterface,
  ) {}

  private extractTokenFromHeader(request: Request): string | undefined {
    const authHeader = request.headers.authorization;
    if (!authHeader) return undefined;
    const [type, token] = authHeader.split(' ');
    return type === 'Bearer' ? token : undefined;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    const token = this.extractTokenFromHeader(request);
    if (!token) throw new UnauthorizedException('Token not provided');

    try {
      const payload = await this.authenticationService.verify(token);
      // Assuming the verify method returns a payload with user information
      // If it returns a boolean, you might need to modify the authentication service
      request['user'] = payload;
    } catch (error: unknown) {
      throw new UnauthorizedException({
        message: 'Invalid token',
        error: error instanceof Error ? error.message : String(error),
        statusCode: 401,
      });
    }

    return true;
  }
}
