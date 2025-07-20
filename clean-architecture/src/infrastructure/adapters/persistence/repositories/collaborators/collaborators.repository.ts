import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infrastructure/config/database/prisma/prisma.service';
import { CollaboratorRepositoryInterface } from 'src/core/application/ports/output/repositories/collaborators/collaborators.repository.interface';
import {
  CollaboratorsCreateInterface,
  CollaboratorsQueryFiltersInterface,
  CollaboratorsResponseInterface,
} from 'src/core/domain/dtos/collaborators/collaborators.db.interface';
import {
  mapToDomainCollaboratorStatus,
  mapToDomainCollaboratorType,
  mapToPrismaCollaboratorStatus,
  mapToPrismaCollaboratorType,
} from 'src/infrastructure/adapters/persistence/mappers/enum-mapper.util';
import { CollaboratorMapper } from '../../mappers/collaborators/collaborators.mappers';
import {
  PaginatedResponse,
  PaginationMapper,
} from '../../mappers/common/pagination.mappers';

@Injectable()
export class CollaboratorRepository implements CollaboratorRepositoryInterface {
  constructor(private readonly prismaService: PrismaService) {}

  async create(
    createCollaborator: CollaboratorsCreateInterface,
  ): Promise<CollaboratorsResponseInterface> {
    const collaborator = await this.prismaService.collaborators.create({
      data: {
        ...createCollaborator,
        ...(createCollaborator.status && {
          status: mapToPrismaCollaboratorStatus(createCollaborator.status),
        }),
        ...(createCollaborator.type && {
          type: mapToPrismaCollaboratorType(createCollaborator.type),
        }),
        created_at: new Date(),
        updated_at: new Date(),
      },
    });

    return CollaboratorMapper.mappedCollaboratorToDomain({
      ...collaborator,
      phone: collaborator.phone ?? '',
      photo: collaborator.photo ?? '',
      status: mapToDomainCollaboratorStatus(collaborator.status),
      type: mapToDomainCollaboratorType(collaborator.type),
    });
  }

  async findAll({
    page: filterPage,
    limit: filtersLimit,
    name,
    email,
    order,
    orderBy,
  }: CollaboratorsQueryFiltersInterface): Promise<
    PaginatedResponse<CollaboratorsResponseInterface>
  > {
    const page = filterPage ?? 1;
    const limit = filtersLimit ?? 10;
    const skip = (page - 1) * limit;

    const [collaborators, total] = await Promise.all([
      this.prismaService.collaborators.findMany({
        skip,
        take: limit,
        orderBy: { [orderBy as string]: order },
        where: {
          ...(name && { name: { contains: name, mode: 'insensitive' } }),
          ...(email && { email: { contains: email, mode: 'insensitive' } }),
        },
      }),
      this.prismaService.collaborators.count({
        where: {
          ...(name && { name: { contains: name, mode: 'insensitive' } }),
          ...(email && { email: { contains: email, mode: 'insensitive' } }),
        },
      }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return PaginationMapper.mappedPaginationResults({
      data: collaborators.map((collaborator) =>
        CollaboratorMapper.mappedCollaboratorToDomain({
          ...collaborator,
          phone: collaborator.phone ?? '',
          photo: collaborator.photo ?? '',
          status: mapToDomainCollaboratorStatus(collaborator.status),
          type: mapToDomainCollaboratorType(collaborator.type),
        }),
      ),
      meta: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  }

  async findById(id: number): Promise<CollaboratorsResponseInterface | null> {
    const collaborator = await this.prismaService.collaborators.findUnique({
      where: { id },
    });

    if (!collaborator) {
      return null;
    }

    return CollaboratorMapper.mappedCollaboratorToDomain({
      ...collaborator,
      phone: collaborator.phone ?? '',
      photo: collaborator.photo ?? '',
      status: mapToDomainCollaboratorStatus(collaborator.status),
      type: mapToDomainCollaboratorType(collaborator.type),
    });
  }

  async update(
    id: number,
    updated: Partial<CollaboratorsCreateInterface>,
  ): Promise<CollaboratorsResponseInterface> {
    const collaborator = await this.prismaService.collaborators.update({
      where: { id },
      data: {
        ...(updated.name && { name: updated.name }),
        ...(updated.email && { email: updated.email }),
        ...(updated.document && { document: updated.document }),
        ...(updated.phone && { phone: updated.phone }),
        ...(updated.password && { password: updated.password }),
        ...(updated.status && {
          status: mapToPrismaCollaboratorStatus(updated.status),
        }),
        ...(updated.type && {
          type: mapToPrismaCollaboratorType(updated.type),
        }),
        updated_at: new Date(),
      },
    });

    return CollaboratorMapper.mappedCollaboratorToDomain({
      ...collaborator,
      phone: collaborator.phone ?? '',
      photo: collaborator.photo ?? '',
      status: mapToDomainCollaboratorStatus(collaborator.status),
      type: mapToDomainCollaboratorType(collaborator.type),
    });
  }

  async delete(id: number): Promise<void> {
    await this.prismaService.collaborators.delete({
      where: { id },
    });
  }

  async findByEmail(
    email: string,
  ): Promise<CollaboratorsResponseInterface | null> {
    const collaborator = await this.prismaService.collaborators.findUnique({
      where: { email },
    });

    if (!collaborator) {
      return null;
    }

    return CollaboratorMapper.mappedCollaboratorToDomain({
      ...collaborator,
      phone: collaborator.phone ?? '',
      photo: collaborator.photo ?? '',
      status: mapToDomainCollaboratorStatus(collaborator.status),
      type: mapToDomainCollaboratorType(collaborator.type),
    });
  }

  async findByDocument(
    document: string,
  ): Promise<CollaboratorsResponseInterface | null> {
    const collaborator = await this.prismaService.collaborators.findUnique({
      where: { document },
    });

    if (!collaborator) {
      return null;
    }

    return {
      ...collaborator,
      status: mapToDomainCollaboratorStatus(collaborator.status),
      type: mapToDomainCollaboratorType(collaborator.type),
    };
  }

  async findByEmailOrDocument(
    email: string,
    document: string,
  ): Promise<CollaboratorsResponseInterface | null> {
    const collaborator = await this.prismaService.collaborators.findFirst({
      where: {
        OR: [{ email }, { document }],
      },
    });

    if (!collaborator) {
      return null;
    }

    return {
      ...collaborator,
      status: mapToDomainCollaboratorStatus(collaborator.status),
      type: mapToDomainCollaboratorType(collaborator.type),
    };
  }
}
