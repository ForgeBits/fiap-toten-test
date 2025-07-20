import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import {
  AuthenticationDto,
  AuthenticationRefreshTokenDto,
} from '../../dtos/authentication/authentication.dto';
import { AuthenticationGuard } from 'src/drivers/aplication/guards/authentication.guard';
import { AuthenticationService } from 'src/infrastructure/modules/authentication/authentication.service';
import { ApiBody, ApiOperation } from '@nestjs/swagger';

@Controller('authentication')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post('login')
  @ApiOperation({ summary: 'Realiza login com CPF e senha' })
  @ApiBody({
    type: AuthenticationDto,
    description: 'Credenciais do usuário para autenticação',
  })
  login(@Body() authenticationDto: AuthenticationDto) {
    return this.authenticationService.login(authenticationDto);
  }

  @Post('refresh-token')
  @ApiOperation({ summary: 'Gera novo access token usando refresh token' })
  @ApiBody({
    type: AuthenticationRefreshTokenDto,
    description: 'Dados necessários para renovar o token de acesso',
  })
  @UseGuards(AuthenticationGuard)
  refreshToken(
    @Body() authenticationRefreshDto: AuthenticationRefreshTokenDto,
  ) {
    return this.authenticationService.refreshToken(authenticationRefreshDto);
  }
}
