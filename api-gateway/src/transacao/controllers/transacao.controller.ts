import { IsNumber, isNumber } from 'class-validator';
import {
  Controller,
  Logger,
  Post,
  Body,
  Get,
  Param,
  UsePipes,
  ValidationPipe,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Observable, pipe, timeout } from 'rxjs';
import { DepositarDto } from '../dtos/depositar.dto';
import { ExtratoDto } from '../dtos/extrato.dto';
import { ExtratoPorPeriodoDto } from '../dtos/extratoPorPerido.dto';
import { SacarDto } from '../dtos/sacar.dto';
import { ClientProxyRMQ } from '../../proxyrmq/services/client-proxyrmq';
import { CircuitBreaker } from 'opossum';

@ApiTags('transacoes')
@Controller('transacoes')
export class TransacaoController {
  logger = new Logger(TransacaoController.name);
  private breaker;
  constructor(private readonly clientProxyRMQ: ClientProxyRMQ) {}

  @ApiOperation({
    summary: 'Depositar',
    description: ' Realizar deposito em conta.',
  })
  @ApiResponse({ status: 201, description: 'Deposito realizado com sucesso.' })
  @ApiResponse({
    status: 404,
    description: 'Recurso solicitado não encontrado.',
  })
  @ApiResponse({
    status: 400,
    description: 'Erro ao processar requisição, favor verificar parâmetros.',
  })
  @ApiResponse({
    status: 501,
    description: 'Error no serivdor ao processar o deposito solcitado.',
  })
  @Post('/depositar/')
  @UsePipes(ValidationPipe)
  dopositar(@Body() depositarDto: DepositarDto): Observable<any> {
    return this.clientProxyRMQ.send('realizar-deposito', depositarDto);
  }

  @ApiOperation({
    summary: 'Sacar',
    description: 'Realizar saque em conta corrente.',
  })
  @ApiResponse({ status: 201, description: 'Saque realizado com sucesso.' })
  @ApiResponse({
    status: 404,
    description: 'Recurso solicitado não encontrado.',
  })
  @ApiResponse({
    status: 400,
    description: 'Erro ao processar requisição, favor verificar parâmetros.',
  })
  @ApiResponse({
    status: 501,
    description: 'Error no serivdor ao processar recurso solcitado.',
  })
  @Post('/sacar')
  @UsePipes(ValidationPipe)
  sacar(@Body() sacarDto: SacarDto): Observable<any> {
    return this.clientProxyRMQ.send('realizar-saque', sacarDto);
  }


  
  @ApiOperation({
    summary: 'Extrato',
    description: 'Realizar extrato completo.',
  })
  @ApiResponse({ status: 200, description: 'Gerado com Sucesso' })
  @ApiResponse({
    status: 404,
    description: 'Recurso solicitado não encontrado.',
  })
  @ApiResponse({
    status: 400,
    description: 'Erro ao processar requisição, favor verificar parâmetros.',
  })
  @ApiResponse({
    status: 501,
    description: 'Error no serivdor ao processar recurso solcitado.',
  })
  @Get('/extrato/:idConta')
  // @UsePipes(ValidationPipe)
  extrato(@Param('idConta', ParseIntPipe) idConta: number): Observable<any> {
    return this.clientProxyRMQ.send('extrato', idConta);
  }

  @ApiOperation({
    summary: 'Extrato por periodo',
    description: 'Retorno o extrato entre duas datas informadas.',
  })
  @ApiResponse({ status: 200, description: 'Criada com Sucesso' })
  @ApiResponse({
    status: 404,
    description: 'Recurso solicitado não encontrado.',
  })
  @ApiResponse({
    status: 400,
    description: 'Erro ao processar requisição, favor verificar parâmetros.',
  })
  @ApiResponse({
    status: 501,
    description: 'Error no serivdor ao processar recurso solcitado.',
  })
  @Get('/extratoporperiodo/:idConta/:dataInicial/:dataFinal')
  //@UsePipes(ValidationPipe)
  extratoPorPeriodo(
    @Param('idConta', ParseIntPipe)  IdConta:  number,
    dataInicial: Date,
    dataFinal: Date,
  ): Observable<any> {

    const extratoPorPeriodoDto: ExtratoPorPeriodoDto =
      new ExtratoPorPeriodoDto();
    extratoPorPeriodoDto.idConta = IdConta;
    extratoPorPeriodoDto.dataInicial = dataInicial;
    extratoPorPeriodoDto.dataFinal = dataFinal;

    return this.clientProxyRMQ.send(
      'extrato-por-periodo',
      extratoPorPeriodoDto,
    );
  }
}
