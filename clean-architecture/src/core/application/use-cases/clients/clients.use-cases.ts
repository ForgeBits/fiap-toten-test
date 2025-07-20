import { Injectable, Inject } from '@nestjs/common';
import { ClientsRepositoryInterface } from '../../ports/output/repositories/clients/clients.repository.interface';
import { handleServiceError } from '../../../../infrastructure/shared/utils/error.handler.util';
import { ClientsUseCases } from '../../ports/input/clients/clients.use-case.port';
import {
  ClientsCreateInterface,
  IdentifyClientInterface,
} from 'src/core/domain/dtos/clients/clients.db.interface';
import { ClientEntity } from 'src/core/domain/entities/clients/clients.entity';
import { TOKENS } from '../../constants/injection.tokens';
import { AppError } from 'src/core/domain/errors/app.error';

@Injectable()
export class ClientUseCasesImpl implements ClientsUseCases {
  constructor(
    @Inject(TOKENS.CLIENTS_REPOSITORY)
    private readonly repository: ClientsRepositoryInterface,
  ) {}

  async create(data: ClientsCreateInterface): Promise<ClientEntity> {
    try {
      const clientExists = await this.repository.findClientByEmailOrDocument({
        document: data.document,
        email: data.email,
      });

      if (clientExists) {
        throw AppError.conflict({
          message: 'Client already exists',
        });
      }

      return await this.repository.create(data);
    } catch (error) {
      handleServiceError(error, 'ClientsUseCases.create');
    }
  }

  async identityClient(
    data: IdentifyClientInterface,
  ): Promise<ClientEntity | null> {
    try {
      const client = await this.repository.identityClient(data);
      if (!client) {
        throw AppError.notFound({
          message: 'Collaborator not found',
        });
      }
      return client;
    } catch (error) {
      handleServiceError(error, 'ClientsUseCases.identityClient');
    }
  }

  async findById(id: number): Promise<ClientEntity> {
    try {
      const client = await this.repository.findById(id);
      if (!client) {
        throw AppError.notFound({
          message: 'Client not found',
        });
      }
      return client;
    } catch (error) {
      handleServiceError(error, 'ClientsUseCases.findById');
    }
  }
}
