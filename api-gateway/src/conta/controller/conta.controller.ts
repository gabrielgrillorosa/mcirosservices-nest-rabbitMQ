import { ConsultarSaldoDto } from './../dtos/consultarSaldo.dto';
/* eslint-disable prettier/prettier */
import { CriarContaDto } from "../dtos/criarConta.dto"
import {
  Body,
  Controller,
  Get,
  Inject,
  Logger,
  Param,
  Patch,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { ClientProxyRMQ } from 'src/proxyrmq/services/client-proxyrmq';
import { lastValueFrom, Observable } from 'rxjs';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BloquearContaDto } from '../dtos/bloquearConta.dto';

@ApiTags('contas')
@Controller('/contas')
export class ContaController {
  logger = new Logger(ContaController.name)
   private breaker;

  constructor(private readonly clientProxyRMQ: ClientProxyRMQ) {}  
  
  @ApiOperation({ summary: 'Cadastrar' , description: "Castrar conta corrente."})
  @ApiResponse({ status: 201, description: 'Castro realizado com sucesso.' })
  @ApiResponse({ status: 401, description: 'Não autorizado.' })
  @ApiResponse({ status: 404, description: 'Recurso solicitado não encontrado.' })
  @ApiResponse({status: 400,description: 'Erro ao processar requisição, favor verificar parâmetros.',})
  @ApiResponse({status: 500, description: 'Error no serivdor ao processar recurso solcitado.', })
  
  @Post()
  @UsePipes(ValidationPipe)
  async criarConta(@Body() criarContaDto: CriarContaDto) {
    this.logger.log(`criarContaDto: ${JSON.stringify(criarContaDto)}`);
    return this.clientProxyRMQ.send('criar-conta', criarContaDto);
  }
  @ApiOperation({ summary: 'Consultar Saldo', description: 'Consultar saldo de conta corrente.'})
  @ApiResponse({ status: 200, description: 'Consulta realizado com sucesso.' })
  @ApiResponse({ status: 404, description: 'Recurso solicitado não encontrado.' })
  @ApiResponse({status: 400,description: 'Erro ao processar requisição, favor verificar parâmetros.',})
  @ApiResponse({status: 500, description: 'Error no serivdor ao processar recurso solcitado.', })
  
  @Get('/saldo/:idConta')
 consultarSaldo(
    @Param() consultarSaldoDto: ConsultarSaldoDto) {
    this.logger.log(`Saldo: ${JSON.stringify(consultarSaldoDto.idConta)}`);
   return this.clientProxyRMQ.send('consutlar-saldo', consultarSaldoDto.idConta);  
  }

  @Get()
  @UsePipes(ValidationPipe)
  listarContas(): Observable<string[]> {
    this.logger.log(`Listar Contas: ${JSON.stringify('Listando contas.')}`);
    return this.clientProxyRMQ.send('consultar-contas', {});
  }

  @ApiOperation({ summary: 'Bloquear', description: "Bloquear conta corrente."})
  @ApiResponse({ status: 201, description: 'Bloqueio realidado com suceso sucesso.' })
  @ApiResponse({ status: 404, description: 'Recurso solicitado não encontrado.' })
  @ApiResponse({status: 400,description: 'Erro ao processar requisição, favor verificar parâmetros.',})
  @ApiResponse({status: 500, description: 'Error no serivdor ao processar recurso solcitado.', })
 
  @Patch('/bloquear/:idConta')
  async bloquear(@Param() bloquearContaDto: BloquearContaDto): Promise<Observable<boolean>> {
    this.logger.log(`${JSON.stringify('Bloqueando conta.')}`);
    try{
       const bloquearContaObs =  this.clientProxyRMQ.send('bloquear-conta', bloquearContaDto.idConta); 
      return await lastValueFrom(bloquearContaObs);
    }catch(error)
    { 
      
      const bloquearContaObs = this.clientProxyRMQ.send('bloquear-conta', bloquearContaDto.idConta); 
      return await lastValueFrom(bloquearContaObs);
    }
  }
}
