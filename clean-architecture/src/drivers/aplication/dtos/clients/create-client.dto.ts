import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsCPF } from 'src/drivers/shared/validators/validator.cpf';

export class CreateClientDto {
  @ApiProperty({ description: 'CPF do cliente', example: '12345678900' })
  @IsString()
  @IsNotEmpty()
  @IsCPF()
  document: string;

  @ApiProperty({
    description: 'Nome completo do cliente',
    example: 'João da Silva',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Email do cliente', example: 'joao@email.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
