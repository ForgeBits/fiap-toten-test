import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infrastructure/config/database/prisma/prisma.service';
import { ClientsRepositoryInterface } from 'src/core/application/ports/output/repositories/clients/clients.repository.interface';
import {
  ClientsCreateInterface,
  IdentifyClientInterface,
} from 'src/core/domain/dtos/clients/clients.db.interface';
import { ClientEntity } from 'src/core/domain/entities/clients/clients.entity';

@Injectable()
export class ClientsRepository implements ClientsRepositoryInterface {
  constructor(private readonly prismaService: PrismaService) {}

  async create(client: ClientsCreateInterface): Promise<ClientEntity> {
    const newClient = await this.prismaService.client.create({
      data: client,
    });

    return newClient;
  }

  async identityClient({
    document,
    email,
  }: IdentifyClientInterface): Promise<ClientEntity | null> {
    const foundClient = await this.prismaService.client.findFirst({
      where: {
        ...(!!document && { document }),
        ...(!!email && { email }),
      },
    });

    if (!foundClient) {
      return null;
    }

    return foundClient;
  }

  async findClientByEmailOrDocument({
    document,
    email,
  }: IdentifyClientInterface): Promise<ClientEntity | null> {
    const foundClient = await this.prismaService.client.findFirst({
      where: {
        ...(!!document && { document }),
        ...(!!email && { email }),
      },
    });

    if (!foundClient) {
      return null;
    }

    return foundClient;
  }

  async findById(id: number): Promise<ClientEntity | null> {
    const foundClient = await this.prismaService.client.findUnique({
      where: { id },
    });

    if (!foundClient) {
      return null;
    }

    return foundClient;
  }
}
