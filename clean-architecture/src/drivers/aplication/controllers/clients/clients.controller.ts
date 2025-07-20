import { Controller, Post, Body, Get } from '@nestjs/common';
import { CreateClientDto } from '../../dtos/clients/create-client.dto';
import { ClientsService } from 'src/infrastructure/modules/clients/clients.service';
import { IdentifyClientDto } from '../../dtos/clients/identify-client.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('clients')
@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Post('create')
  @ApiOperation({ summary: 'Cria um novo cliente' })
  @ApiBody({ type: CreateClientDto })
  @ApiResponse({ status: 201, description: 'Cliente criado com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  create(@Body() createClientDto: CreateClientDto) {
    return this.clientsService.create(createClientDto);
  }

  @Post('identity-client')
  @ApiOperation({ summary: 'Identifica cliente pelo CPF' })
  @ApiBody({ type: IdentifyClientDto })
  @ApiResponse({
    status: 200,
    description: 'Cliente identificado com sucesso',
    schema: {
      example: {
        id: 1,
        name: 'João da Silva',
        email: 'joao@email.com',
        document: '12345678900',
      },
    },
  })
  @Post('identity-client')
  identityClient(@Body() identifyClientDto: IdentifyClientDto) {
    return this.clientsService.identityClient(identifyClientDto);
  }

  @Get('generate-identify')
  @ApiOperation({
    summary: 'Gera um código de identificação aleatório de 6 dígitos',
  })
  @ApiResponse({
    status: 200,
    description: 'Código gerado com sucesso',
    schema: {
      example: {
        code: 123456,
      },
    },
  })
  generateIdentify() {
    const randomNumber = Math.floor(100000 + Math.random() * 900000);
    return { code: randomNumber };
  }
}
