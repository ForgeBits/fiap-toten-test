import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CollaboratorStatus } from 'src/core/domain/value-objects/collaborators/collaborators-status.enum';
import { CollaboratorType } from 'src/core/domain/value-objects/collaborators/collaborators-type.enum';
import { IsCPF } from 'src/drivers/shared/validators/validator.cpf';

export class CreateCollaboratorDto {
  @ApiProperty({
    description: 'CPF do colaborador',
    example: '12345678909',
  })
  @IsString()
  @IsNotEmpty()
  @IsCPF()
  document: string;

  @ApiProperty({
    description: 'Nome completo do colaborador',
    example: 'Ana Souza',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Email do colaborador',
    example: 'ana.souza@email.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiPropertyOptional({
    description: 'Telefone do colaborador',
    example: '(11) 91234-5678',
  })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({
    description: 'URL da foto do colaborador',
    example: 'https://exemplo.com/foto.jpg',
  })
  @IsString()
  @IsOptional()
  photo?: string;

  @ApiProperty({
    description: 'Tipo de colaborador',
    enum: CollaboratorType,
    example: CollaboratorType.Admin,
  })
  @IsEnum(CollaboratorType)
  @IsNotEmpty()
  type: CollaboratorType;

  @ApiProperty({
    description: 'Status do colaborador',
    enum: CollaboratorStatus,
    example: CollaboratorStatus.Active,
  })
  @IsEnum(CollaboratorStatus)
  @IsNotEmpty()
  status: CollaboratorStatus;

  @ApiProperty({
    description: 'Senha de acesso do colaborador',
    example: 'senha123segura',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
