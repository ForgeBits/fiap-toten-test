import {
  CollaboratorsInterface,
  CollaboratorsResponseInterface,
} from 'src/core/domain/dtos/collaborators/collaborators.db.interface';

export class CollaboratorMapper {
  static mappedCollaboratorToDomain(
    data: CollaboratorsInterface,
  ): CollaboratorsResponseInterface {
    return {
      id: data.id,
      name: data.name,
      email: data.email,
      status: data.status,
      type: data.type,
      document: data.document,
      ...(!!data.phone && { phone: data.phone ?? null }),
      ...(!!data.photo && { photo: data.photo ?? null }),
      created_at: data.created_at,
      updated_at: data.updated_at,
    };
  }
}
