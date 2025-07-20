import { Inject, Injectable } from '@nestjs/common';
import { TOKENS } from 'src/core/application/constants/injection.tokens';
import { CollaboratorUseCases } from 'src/core/application/ports/input/collaborators/collaborators.use-case.port';
import { PaginatedResult } from 'src/core/domain/dtos/common/pagination.query.db.interface';
import { CollaboratorEntity } from 'src/core/domain/entities/collaborators/collaborator.entity';
import { CollaboratorsFiltersQueryDto } from 'src/drivers/aplication/dtos/collaborators/collaborators.filters.query.dto';
import { CreateCollaboratorDto } from 'src/drivers/aplication/dtos/collaborators/create-collaborator.dto';
import { UpdateCollaboratorDto } from 'src/drivers/aplication/dtos/collaborators/update-collaborator.dto';

@Injectable()
export class CollaboratorsService {
  constructor(
    @Inject(TOKENS.COLLABORATOR_USE_CASES)
    private readonly collaboratorUseCases: CollaboratorUseCases,
  ) {}

  async findAll(
    filters: CollaboratorsFiltersQueryDto,
  ): Promise<PaginatedResult<CollaboratorEntity>> {
    return await this.collaboratorUseCases.findAll(filters);
  }

  async create(
    createCollaboratorDto: CreateCollaboratorDto,
  ): Promise<CollaboratorEntity> {
    return await this.collaboratorUseCases.create(createCollaboratorDto);
  }

  async findOne(id: number): Promise<CollaboratorEntity> {
    return await this.collaboratorUseCases.findById(id);
  }

  update(
    id: number,
    updated: Partial<UpdateCollaboratorDto>,
  ): Promise<CollaboratorEntity> {
    return this.collaboratorUseCases.update(id, updated);
  }

  deleteCollaborator(id: number): Promise<void> {
    return this.collaboratorUseCases.delete(id);
  }
}
