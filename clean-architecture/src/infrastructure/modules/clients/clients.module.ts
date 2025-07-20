import { Module } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { ClientUseCasesImpl } from 'src/core/application/use-cases/clients/clients.use-cases';
import { ClientsRepository } from 'src/infrastructure/adapters/persistence/repositories/clients/clients.repository';
import { PrismaService } from 'src/infrastructure/config/database/prisma/prisma.service';
import { TOKENS } from 'src/core/application/constants/injection.tokens';
import { ClientsController } from 'src/drivers/aplication/controllers/clients/clients.controller';

@Module({
  controllers: [ClientsController],
  providers: [
    PrismaService,
    ClientsService,
    {
      provide: TOKENS.CLIENTS_USE_CASES,
      useClass: ClientUseCasesImpl,
    },
    {
      provide: TOKENS.CLIENTS_REPOSITORY,
      useClass: ClientsRepository,
    },
  ],
  exports: [TOKENS.CLIENTS_USE_CASES, TOKENS.CLIENTS_REPOSITORY],
})
export class ClientsModule {}
