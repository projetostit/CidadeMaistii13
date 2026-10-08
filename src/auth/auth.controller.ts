import { Body, Controller, Get, Headers, Post, Put } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/registro.dto';
import { LoginDto } from './dto/login.dto';
import { AtualizarPerfilDto } from './dto/atualizar-perfil.dto';

@Controller('')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('cadastrar')
  register(@Body() dados: RegisterDto) {
    return this.authService.register(dados);
  }

  @Post('login')
  login(@Body() dados: LoginDto) {
    return this.authService.login(dados);
  }

  @Get('perfil')
  perfil(@Headers('authorization') cabecalho: string) {
    return this.authService.perfil(cabecalho);
  }

  @Put('perfil')
  atualizarPerfil(
    @Headers('authorization') cabecalho: string,
    @Body() dados: AtualizarPerfilDto,
  ) {
    return this.authService.atualizarPerfil(cabecalho, dados);
  }
}