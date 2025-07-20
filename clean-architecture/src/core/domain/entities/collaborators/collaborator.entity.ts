import { CollaboratorStatus } from '../../value-objects/collaborators/collaborators-status.enum';
import { CollaboratorType } from '../../value-objects/collaborators/collaborators-type.enum';

export class CollaboratorEntity {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  document: string;
  photo?: string | null;
  type: CollaboratorType;
  status: CollaboratorStatus;
  password?: string;
  created_at: Date;
  updated_at: Date;
}
