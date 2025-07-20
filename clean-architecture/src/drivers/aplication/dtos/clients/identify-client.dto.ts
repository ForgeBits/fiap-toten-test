import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsCPF } from 'src/drivers/shared/validators/validator.cpf';

export class IdentifyClientDto {
  @ApiProperty({ description: 'CPF do cliente', example: '12345678900' })
  @IsString()
  @IsNotEmpty()
  @IsCPF()
  document: string;
}
