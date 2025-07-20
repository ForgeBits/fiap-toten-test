import {
  ClientsCreateInterface,
  IdentifyClientInterface,
} from 'src/core/domain/dtos/clients/clients.db.interface';
import { ClientEntity } from 'src/core/domain/entities/clients/clients.entity';

export interface ClientsUseCases {
  create(data: ClientsCreateInterface): Promise<ClientEntity>;
  identityClient(data: IdentifyClientInterface): Promise<ClientEntity | null>;
  findById(id: number): Promise<ClientEntity>;
}
