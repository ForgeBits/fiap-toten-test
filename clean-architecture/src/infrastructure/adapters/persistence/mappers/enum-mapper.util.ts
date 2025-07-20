import { CollaboratorType, CollaboratorStatus } from '@prisma/client';
import { CollaboratorType as EnumCollaboratorType } from 'src/core/domain/value-objects/collaborators/collaborators-type.enum';
import { CollaboratorStatus as EnumCollaboratorStatus } from 'src/core/domain/value-objects/collaborators/collaborators-status.enum';
import { PaymentStatus } from 'src/core/domain/value-objects/payment/payment.status.enum';
import { PaymentExternalStatus } from 'src/core/domain/dtos/payment/payment.db.interface';

/**
 * Mapeia o tipo de colaborador do domínio para o tipo do Prisma
 */
export function mapToPrismaCollaboratorType(
  type: EnumCollaboratorType,
): CollaboratorType {
  switch (type) {
    case EnumCollaboratorType.Admin:
      return CollaboratorType.Admin;
    case EnumCollaboratorType.Operator:
      return CollaboratorType.Operator;
    case EnumCollaboratorType.Manager:
      return CollaboratorType.Manager;
    case EnumCollaboratorType.Supervisor:
      return CollaboratorType.Supervisor;
    default:
      throw new Error(`Unknown collaborator type: ${String(type)}`);
  }
}

/**
 * Mapeia o tipo de colaborador do Prisma para o tipo do domínio
 */
export function mapToDomainCollaboratorType(
  type: CollaboratorType,
): EnumCollaboratorType {
  switch (type) {
    case CollaboratorType.Admin:
      return EnumCollaboratorType.Admin;
    case CollaboratorType.Operator:
      return EnumCollaboratorType.Operator;
    case CollaboratorType.Manager:
      return EnumCollaboratorType.Manager;
    case CollaboratorType.Supervisor:
      return EnumCollaboratorType.Supervisor;
    default:
      throw new Error(`Unknown Prisma collaborator type: ${String(type)}`);
  }
}

/**
 * Mapeia o status de colaborador do domínio para o status do Prisma
 */
export function mapToPrismaCollaboratorStatus(
  status: EnumCollaboratorStatus,
): CollaboratorStatus {
  switch (status) {
    case EnumCollaboratorStatus.Active:
      return CollaboratorStatus.Active;
    case EnumCollaboratorStatus.Inactive:
      return CollaboratorStatus.Inactive;
    default:
      throw new Error(`Unknown collaborator status: ${String(status)}`);
  }
}

/**
 * Mapeia o status de colaborador do Prisma para o status do domínio
 */
export function mapToDomainCollaboratorStatus(
  status: CollaboratorStatus,
): EnumCollaboratorStatus {
  switch (status) {
    case CollaboratorStatus.Active:
      return EnumCollaboratorStatus.Active;
    case CollaboratorStatus.Inactive:
      return EnumCollaboratorStatus.Inactive;
    default:
      throw new Error(`Unknown Prisma collaborator status: ${String(status)}`);
  }
}

/**
 * Mapeia o status do pagamento para o status do domínio
 */
export function mapToDomainPaymentStatus(
  status: PaymentExternalStatus,
): PaymentStatus {
  switch (status) {
    case PaymentExternalStatus.APPROVED:
      return PaymentStatus.PAID;
    case PaymentExternalStatus.CANCELLED:
      return PaymentStatus.CANCELED;
    case PaymentExternalStatus.REJECTED:
      return PaymentStatus.FAILED;
    case PaymentExternalStatus.EXPIRED:
      return PaymentStatus.EXPIRED;
    default:
      return PaymentStatus.PENDING;
  }
}
