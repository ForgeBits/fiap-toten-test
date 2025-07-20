import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthenticationService } from './authentication.service';
import { BcryptService } from 'src/infrastructure/adapters/services/cryptography/bcrypt-service.service';
import { AuthenticationRepositoryService } from 'src/infrastructure/adapters/persistence/repositories/authentication/authentication.repository';
import { AuthenticationServiceProvider } from 'src/infrastructure/adapters/services/authentication/authentication.service';
import { PrismaService } from 'src/infrastructure/config/database/prisma/prisma.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthenticationUseCasesImpl } from 'src/core/application/use-cases/authentication/authentication.use-cases';
import { TOKENS } from 'src/core/application/constants/injection.tokens';
import { CollaboratorRepository } from 'src/infrastructure/adapters/persistence/repositories/collaborators/collaborators.repository';
import { AuthenticationController } from 'src/drivers/aplication/controllers/authentication/authentication.controller';

@Module({
  imports: [
    PassportModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('jwtSecret'),
        signOptions: { expiresIn: configService.get<string>('expirationTime') },
      }),
    }),
  ],
  controllers: [AuthenticationController],
  providers: [
    PrismaService,
    ConfigService,
    AuthenticationService,
    {
      provide: TOKENS.AUTHENTICATION_REPOSITORY,
      useClass: AuthenticationRepositoryService,
    },
    {
      provide: TOKENS.AUTHENTICATION_SERVICE,
      useClass: AuthenticationServiceProvider,
    },
    {
      provide: TOKENS.ENCRYPTION_SERVICE,
      useClass: BcryptService,
    },
    {
      provide: TOKENS.AUTHENTICATION_USE_CASES,
      useClass: AuthenticationUseCasesImpl,
    },
    {
      provide: TOKENS.COLLABORATOR_REPOSITORY,
      useClass: CollaboratorRepository,
    },
  ],
  exports: [TOKENS.AUTHENTICATION_SERVICE],
})
export class AuthenticationModule {}
