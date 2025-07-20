import { CollaboratorStatus } from '../../value-objects/collaborators/collaborators-status.enum';
import { CollaboratorType } from '../../value-objects/collaborators/collaborators-type.enum';
import { PaginationQueryDbInterface } from '../common/pagination.query.db.interface';

export interface CollaboratorsCreateInterface {
  name: string;
  email: string;
  phone?: string;
  document: string;
  photo?: string;
  type: CollaboratorType;
  status: CollaboratorStatus;
  password: string;
}

export interface CollaboratorsQueryFiltersInterface
  extends PaginationQueryDbInterface {
  name?: string;
  email?: string;
}

export interface CollaboratorsInterface {
  id: number;
  name: string;
  email: string;
  phone?: string;
  document: string;
  photo?: string;
  type: CollaboratorType;
  status: CollaboratorStatus;
  created_at: Date;
  updated_at: Date;
}

export interface CollaboratorsResponseInterface {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  document: string;
  photo?: string | null;
  type: CollaboratorType;
  status: CollaboratorStatus;
  created_at: Date;
  updated_at: Date;
}
