import { Module } from '@nestjs/common';
import { CollaboratorsService } from './collaborators.service';
import { AuthenticationModule } from '../authentication/authentication.module';
import { CollaboratorUseCasesImpl } from 'src/core/application/use-cases/collaborators/collaborators.use-cases';
import { CollaboratorsController } from 'src/drivers/aplication/controllers/collaborators/collaborators.controller';
import { PrismaService } from 'src/infrastructure/config/database/prisma/prisma.service';
import { CollaboratorRepository } from 'src/infrastructure/adapters/persistence/repositories/collaborators/collaborators.repository';
import { BcryptService } from 'src/infrastructure/adapters/services/cryptography/bcrypt-service.service';
import { TOKENS } from 'src/core/application/constants/injection.tokens';

@Module({
  imports: [AuthenticationModule],
  controllers: [CollaboratorsController],
  providers: [
    PrismaService,
    CollaboratorsService,
    {
      provide: TOKENS.COLLABORATOR_USE_CASES,
      useClass: CollaboratorUseCasesImpl,
    },
    {
      provide: TOKENS.COLLABORATOR_REPOSITORY,
      useClass: CollaboratorRepository,
    },
    {
      provide: TOKENS.ENCRYPTION_SERVICE,
      useClass: BcryptService,
    },
  ],
  exports: [
    TOKENS.COLLABORATOR_USE_CASES,
    TOKENS.COLLABORATOR_REPOSITORY,
    TOKENS.ENCRYPTION_SERVICE,
    CollaboratorsService,
  ],
})
export class CollaboratorsModule {}
