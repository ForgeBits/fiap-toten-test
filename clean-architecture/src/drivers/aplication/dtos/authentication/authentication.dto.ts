import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { IsCPF } from 'src/drivers/shared/validators/validator.cpf';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AuthenticationDto {
  @ApiProperty({
    description: 'CPF do usuário',
    example: '22272874207',
  })
  @IsString()
  @IsNotEmpty()
  @IsCPF()
  document: string;

  @ApiProperty({
    description: 'Senha do usuário',
    example: 'pass@123',
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  @IsEmail()
  @IsOptional()
  email: string;
}

export class AuthenticationRefreshTokenDto {
  @ApiPropertyOptional({
    description: 'Access token atual (opcional)',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  @IsString()
  @IsOptional()
  accessToken: string;

  @ApiProperty({
    description: 'Refresh token válido para gerar novo access token',
    example: '9e5a16c4-a951-49aa-a99d-65012a0a9a8b',
  })
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}
