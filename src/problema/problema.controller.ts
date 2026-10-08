import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Headers,
} from '@nestjs/common';
import { ProblemaService } from './problema.service';
import { AuthService } from '../auth/auth.service';

@Controller('problemas')
export class ProblemaController {
  constructor(
    private readonly problemaService: ProblemaService,
    private readonly authService: AuthService,
  ) {}

  @Get()
  async buscarTodos(@Headers('authorization') cabecalho: string) {
    const idCidadao = await this.authService.pegarIdDoToken(cabecalho);
    return this.problemaService.buscarTodos(idCidadao);
  }

  @Get(':id')
  async buscarPorId(
    @Param('id') id: string,
    @Headers('authorization') cabecalho: string,
  ) {
    const idCidadao = await this.authService.pegarIdDoToken(cabecalho);
    return this.problemaService.buscarPorId(Number(id), idCidadao);
  }

  @Post()
  async criar(
    @Body() dados: any,
    @Headers('authorization') cabecalho: string,
  ) {
    const idCidadao = await this.authService.pegarIdDoToken(cabecalho);
    return this.problemaService.criar(dados, idCidadao);
  }

    @Put(':id')
  async atualizar(
    @Param('id') id: string,
    @Body() dados: any,
    @Headers('authorization') cabecalho: string,
  ) {
    const idCidadao = await this.authService.pegarIdDoToken(cabecalho);

    // só consulta o CEP se a pessoa preencheu
    let endereco: any = null;

    if (dados.cep) {
      endereco = await this.authService.buscarCep(dados.cep);
    }

    return this.problemaService.atualizar(Number(id), dados, endereco, idCidadao);
  }

  @Delete(':id')
  async excluir(
    @Param('id') id: string,
    @Headers('authorization') cabecalho: string,
  ) {
    const idCidadao = await this.authService.pegarIdDoToken(cabecalho);
    return this.problemaService.excluir(Number(id), idCidadao);
  }
}