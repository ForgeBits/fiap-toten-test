import {
  ClientsCreateInterface,
  IdentifyClientInterface,
} from 'src/core/domain/dtos/clients/clients.db.interface';
import { ClientEntity } from 'src/core/domain/entities/clients/clients.entity';

export interface ClientsRepositoryInterface {
  create(client: ClientsCreateInterface): Promise<ClientEntity>;
  identityClient(client: IdentifyClientInterface): Promise<ClientEntity | null>;
  findClientByEmailOrDocument(
    client: IdentifyClientInterface,
  ): Promise<ClientEntity | null>;
  findById(id: number): Promise<ClientEntity | null>;
}
