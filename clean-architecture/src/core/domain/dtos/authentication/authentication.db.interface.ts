import { CollaboratorEntity } from '../../entities/collaborators/collaborator.entity';

export interface AuthenticationBodyInterface {
  email?: string;
  password: string;
  document: string;
}

export interface AuthenticationRefreshTokenBodyInterface {
  accessToken: string;
  refreshToken: string;
}

export interface AuthenticationResponse {
  accessToken?: string;
  refreshToken: string;
  user?: Partial<CollaboratorEntity>;
}

export interface AuthenticationResponseInterface {
  accessToken: string;
  refreshToken: string;
}
