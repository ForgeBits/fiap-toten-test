import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { AuthenticationGuard } from 'src/drivers/aplication/guards/authentication.guard';
import { CreateCollaboratorDto } from '../../dtos/collaborators/create-collaborator.dto';
import { UpdateCollaboratorDto } from '../../dtos/collaborators/update-collaborator.dto';
import { CollaboratorsService } from 'src/infrastructure/modules/collaborators/collaborators.service';
import { CollaboratorsFiltersQueryDto } from '../../dtos/collaborators/collaborators.filters.query.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('collaborators')
@UseGuards(AuthenticationGuard)
@Controller('collaborators')
export class CollaboratorsController {
  constructor(private readonly CollaboratorsService: CollaboratorsService) {}

  @Post()
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Cria um novo colaborador' })
  @ApiBody({
    type: CreateCollaboratorDto,
    description: 'Dados para criação do colaborador',
  })
  create(@Body() createCollaboratorDto: CreateCollaboratorDto) {
    return this.CollaboratorsService.create(createCollaboratorDto);
  }

  @Get()
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Lista os colaboradores com filtros opcionais' })
  findAll(@Query() filters: CollaboratorsFiltersQueryDto) {
    return this.CollaboratorsService.findAll(filters);
  }

  @Get(':id')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Busca um colaborador pelo ID' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID do colaborador a ser consultado',
    example: 7,
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.CollaboratorsService.findOne(+id);
  }

  @Patch(':id')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Atualiza os dados de um colaborador existente' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID do colaborador a ser atualizado',
    example: 7,
  })
  @ApiBody({
    type: UpdateCollaboratorDto,
    description: 'Campos do colaborador que podem ser atualizados',
  })
  update(
    @Param('id') id: string,
    @Body() updateCollaboratorDto: UpdateCollaboratorDto,
  ) {
    return this.CollaboratorsService.update(+id, updateCollaboratorDto);
  }

  @ApiOperation({ summary: 'Remove um colaborador pelo ID' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID do colaborador a ser removido',
    example: 7,
  })
  @ApiBearerAuth('JWT-auth')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.CollaboratorsService.deleteCollaborator(+id);
  }
}
