import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateOrderDto } from '../../dtos/orders/create-order.dto';
import { UpdateOrderDto } from '../../dtos/orders/update-order.dto';
import { OrdersService } from 'src/infrastructure/modules/orders/orders.service';
import { OrdersFiltersQueryDto } from '../../dtos/orders/orders.filters.query.dto';
import { UpdateStatusOrderDto } from '../../dtos/orders/update-status-order.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { AuthenticationGuard } from '../../guards/authentication.guard';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiOperation({ summary: 'Cria um novo pedido' })
  @ApiBody({ type: CreateOrderDto })
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(createOrderDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lista todos os pedidos' })
  @Get()
  findAll(@Query() filters: OrdersFiltersQueryDto) {
    return this.ordersService.findAll(filters);
  }

  @Get('ready-prepare')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AuthenticationGuard)
  @ApiOperation({ summary: 'Lista os pedidos prontos para preparo' })
  findAllOrdersReadyToPrepare(@Query() filters: OrdersFiltersQueryDto) {
    return this.ordersService.findAllReadyToPrepare(filters);
  }

  @ApiOperation({ summary: 'Lista os pedidos prontos para entrega' })
  @Get('ready-deliver')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AuthenticationGuard)
  findAllOrdersReadyToDeliver(@Query() filters: OrdersFiltersQueryDto) {
    return this.ordersService.findAllReadyToDeliver(filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Busca um pedido pelo ID' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID do pedido a ser consultado',
    example: 123,
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualiza um pedido existente pelo ID' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID do pedido a ser atualizado',
    example: 123,
  })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AuthenticationGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.update(+id, updateOrderDto);
  }

  @Delete(':id')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Remove um pedido pelo ID' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID do pedido a ser removido',
    example: 123,
  })
  @UseGuards(AuthenticationGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ordersService.remove(+id);
  }

  @Patch(':id/initiate-preparation')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Inicia o preparo de um pedido' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID do pedido que será iniciado o preparo',
    example: 123,
  })
  @ApiBody({
    type: UpdateStatusOrderDto,
    description: 'Novo status do pedido (por exemplo, "IN_PREPARATION")',
  })
  @UseGuards(AuthenticationGuard)
  @Patch(':id/initiate-preparation')
  initiatePreparation(
    @Param('id') id: string,
    @Body() updateOrderStatusDto: UpdateStatusOrderDto,
  ) {
    return this.ordersService.initiatePreparation(+id, updateOrderStatusDto);
  }

  @Patch(':id/finish-preparation')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Finaliza o preparo de um pedido' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID do pedido a ser finalizado o preparo',
    example: 123,
  })
  @ApiBody({
    type: UpdateStatusOrderDto,
    description: 'Novo status do pedido (por exemplo, "READY_TO_DELIVER")',
  })
  @UseGuards(AuthenticationGuard)
  @Patch(':id/finish-preparation')
  finishPreparation(
    @Param('id') id: string,
    @Body() updateOrderStatusDto: UpdateStatusOrderDto,
  ) {
    return this.ordersService.finishPreparation(+id, updateOrderStatusDto);
  }

  @Patch(':id/finish-order')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Atualiza o status de um pedido indicando a entrega',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID do pedido que foi entregue',
    example: 123,
  })
  @ApiBody({
    type: UpdateStatusOrderDto,
    description: 'Novo status do pedido (por exemplo, "DONE")',
  })
  @Patch(':id/finish-order')
  @UseGuards(AuthenticationGuard)
  finishOrder(
    @Param('id') id: string,
    @Body() updateOrderStatusDto: UpdateStatusOrderDto,
  ) {
    return this.ordersService.finishOrder(+id, updateOrderStatusDto);
  }
}
