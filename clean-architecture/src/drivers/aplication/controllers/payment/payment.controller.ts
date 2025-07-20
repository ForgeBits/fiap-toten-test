import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { PaymentService } from '../../../../infrastructure/modules/payment/payment.service';
import { CreatePaymentDto } from '../../dtos/payment/create-payment.dto';
import { PaymentEntity } from 'src/core/domain/entities/payment/payment.entity';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { AuthenticationGuard } from '../../guards/authentication.guard';

@ApiTags('payment')
@UseGuards(AuthenticationGuard)
@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('create')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Cria um novo pagamento' })
  @ApiBody({
    type: CreatePaymentDto,
    description: 'Dados necessários para criar um pagamento',
  })
  async createPayment(
    @Body() CreatePaymentDto: CreatePaymentDto,
  ): Promise<PaymentEntity> {
    return await this.paymentService.createPayment(CreatePaymentDto);
  }

  @Get('status/:transactionId')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Consulta o status de um pagamento' })
  @ApiParam({
    name: 'transactionId',
    type: String,
    description: 'ID da transação do pagamento',
    example: 'abc123def456',
  })
  async getPaymentStatus(
    @Param('transactionId') transactionId: string,
  ): Promise<PaymentEntity> {
    return await this.paymentService.getPaymentStatus(transactionId);
  }

  @Delete('cancel/:transactionId')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Cancela um pagamento existente' })
  @ApiParam({
    name: 'transactionId',
    type: String,
    description: 'ID da transação de pagamento a ser cancelada',
    example: 'abc123def456',
  })
  async cancelPayment(
    @Param('transactionId') transactionId: string,
  ): Promise<{ message: string }> {
    await this.paymentService.cancelPayment(transactionId);
    return { message: 'Payment cancelled successfully' };
  }
}
