import { Inject, Injectable } from '@nestjs/common';
import { CollaboratorEntity } from '../../../domain/entities/collaborators/collaborator.entity';
import {
  CollaboratorsCreateInterface,
  CollaboratorsQueryFiltersInterface,
} from '../../../domain/dtos/collaborators/collaborators.db.interface';
import { CollaboratorRepositoryInterface } from '../../ports/output/repositories/collaborators/collaborators.repository.interface';
import { EncryptionServiceInterface } from '../../ports/output/services/encryption/encryption.service.interface';
import { AppError } from '../../../domain/errors/app.error';
import { handleServiceError } from '../../../../infrastructure/shared/utils/error.handler.util';
import { CollaboratorUseCases } from '../../ports/input/collaborators/collaborators.use-case.port';
import { TOKENS } from 'src/core/application/constants/injection.tokens';
import { PaginatedResult } from 'src/core/domain/dtos/common/pagination.query.db.interface';

@Injectable()
export class CollaboratorUseCasesImpl implements CollaboratorUseCases {
  constructor(
    @Inject(TOKENS.COLLABORATOR_REPOSITORY)
    private readonly repository: CollaboratorRepositoryInterface,
    @Inject(TOKENS.ENCRYPTION_SERVICE)
    private readonly encryptionService: EncryptionServiceInterface,
  ) {}

  async findAll(
    filters: CollaboratorsQueryFiltersInterface,
  ): Promise<PaginatedResult<CollaboratorEntity>> {
    try {
      return await this.repository.findAll(filters);
    } catch (error) {
      handleServiceError(error, 'CollaboratorUseCases.findAll');
    }
  }

  async findById(id: number): Promise<CollaboratorEntity> {
    try {
      const collaborator = await this.repository.findById(id);
      if (!collaborator) {
        throw AppError.notFound({
          message: 'Collaborator not found',
        });
      }
      return collaborator;
    } catch (error) {
      handleServiceError(error, 'CollaboratorUseCases.findById');
    }
  }

  async create(
    data: CollaboratorsCreateInterface,
  ): Promise<CollaboratorEntity> {
    try {
      const existingCollaborator = await this.repository.findByEmailOrDocument(
        data.email,
        data.document,
      );
      if (existingCollaborator) {
        throw AppError.conflict({
          message: 'Collaborator with this email or document already exists',
        });
      }

      const hashedPassword = await this.encryptionService.hash(data.password);

      return await this.repository.create({
        ...data,
        password: hashedPassword,
      });
    } catch (error) {
      handleServiceError(error, 'CollaboratorUseCases.create');
    }
  }

  async update(
    id: number,
    updatedData: Partial<CollaboratorsCreateInterface>,
  ): Promise<CollaboratorEntity> {
    try {
      const existingCollaborator = await this.repository.findById(id);
      if (!existingCollaborator) {
        throw AppError.notFound({
          message: 'Collaborator not found',
        });
      }

      return await this.repository.update(id, updatedData);
    } catch (error) {
      handleServiceError(error, 'CollaboratorUseCases.update');
    }
  }

  async delete(id: number): Promise<void> {
    try {
      const existingCollaborator = await this.repository.findById(id);
      if (!existingCollaborator) {
        throw AppError.notFound({
          message: 'Collaborator not found',
        });
      }

      await this.repository.delete(id);
    } catch (error) {
      handleServiceError(error, 'CollaboratorUseCases.delete');
    }
  }
}
