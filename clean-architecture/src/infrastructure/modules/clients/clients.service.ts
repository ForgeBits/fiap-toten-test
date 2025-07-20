import { Inject, Injectable } from '@nestjs/common';
import { TOKENS } from 'src/core/application/constants/injection.tokens';
import { ClientsUseCases } from 'src/core/application/ports/input/clients/clients.use-case.port';
import { CreateClientDto } from 'src/drivers/aplication/dtos/clients/create-client.dto';
import { IdentifyClientDto } from 'src/drivers/aplication/dtos/clients/identify-client.dto';

@Injectable()
export class ClientsService {
  constructor(
    @Inject(TOKENS.CLIENTS_USE_CASES)
    private readonly clientUseCase: ClientsUseCases,
  ) {}

  async create(createClientDto: CreateClientDto) {
    return await this.clientUseCase.create(createClientDto);
  }

  async identityClient(IdentifyClientDto: IdentifyClientDto) {
    return await this.clientUseCase.identityClient(IdentifyClientDto);
  }
}
