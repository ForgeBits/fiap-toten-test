import {
  AuthenticationResponse,
  AuthenticationResponseInterface,
} from 'src/core/domain/dtos/authentication/authentication.db.interface';
import { CollaboratorsInterface } from 'src/core/domain/dtos/collaborators/collaborators.db.interface';

export interface AuthenticationServiceInterface {
  login(
    loggedUser: Partial<CollaboratorsInterface>,
  ): AuthenticationResponseInterface;
  verify(token: string): Promise<boolean>;
  verifyRefreshToken(token: string): Promise<Partial<AuthenticationResponse>>;
}
