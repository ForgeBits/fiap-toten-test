import { CollaboratorEntity } from 'src/core/domain/entities/collaborators/collaborator.entity';
import {
  CollaboratorsCreateInterface,
  CollaboratorsQueryFiltersInterface,
} from 'src/core/domain/dtos/collaborators/collaborators.db.interface';
import { PaginatedResult } from 'src/core/domain/dtos/common/pagination.query.db.interface';

export interface CollaboratorUseCases {
  findAll(
    filters: CollaboratorsQueryFiltersInterface,
  ): Promise<PaginatedResult<CollaboratorEntity>>;
  findById(id: number): Promise<CollaboratorEntity>;
  create(data: CollaboratorsCreateInterface): Promise<CollaboratorEntity>;
  update(
    id: number,
    data: Partial<CollaboratorsCreateInterface>,
  ): Promise<CollaboratorEntity>;
  delete(id: number): Promise<void>;
}
