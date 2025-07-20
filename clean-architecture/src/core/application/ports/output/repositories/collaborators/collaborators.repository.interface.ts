import {
  CollaboratorsCreateInterface,
  CollaboratorsQueryFiltersInterface,
} from 'src/core/domain/dtos/collaborators/collaborators.db.interface';
import { CollaboratorEntity } from '../../../../../domain/entities/collaborators/collaborator.entity';
import { PaginatedResult } from 'src/core/domain/dtos/common/pagination.query.db.interface';

export interface CollaboratorRepositoryInterface {
  create(
    collaborator: CollaboratorsCreateInterface,
  ): Promise<CollaboratorEntity>;
  findAll(
    filters: CollaboratorsQueryFiltersInterface,
  ): Promise<PaginatedResult<CollaboratorEntity>>;
  findById(id: number): Promise<CollaboratorEntity | null>;
  update(
    id: number,
    updated: Partial<CollaboratorsCreateInterface>,
  ): Promise<CollaboratorEntity>;
  delete(id: number): Promise<void>;
  findByEmail(email: string): Promise<CollaboratorEntity | null>;
  findByDocument(document: string): Promise<CollaboratorEntity | null>;
  findByEmailOrDocument(
    email: string,
    document: string,
  ): Promise<CollaboratorEntity | null>;
}
