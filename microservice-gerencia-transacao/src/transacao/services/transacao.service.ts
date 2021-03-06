import { ResultadoTransacaoDto } from './../dto/resultadoTransacao.dto';
import { ClientProxyRMQ } from '../../proxyrmq/client-proxyrmq';
import { is } from 'sequelize/types/lib/operators';
import { ContaDto } from './../dto/conta.dto';
import { TransacaoRepositorio } from '../repository/trasacao.repository';
import { HttpStatus, Inject, Injectable, Logger, Next } from '@nestjs/common';
import { DepositarDto } from '../dto/depositar.dto';
import { Transacao } from '../entity/transacao.entity';
import { SacarDto } from '../dto/sacarDto';

import { ExtratoPorPeriodoDto } from '../dto/extratoPorPeriodoDto.dtos';
import { RpcException } from '@nestjs/microservices';
import {
  retry,
  timeout,
  pipe,
  tap,
  Observable,
  Subscriber,
  lastValueFrom,
  firstValueFrom,
} from 'rxjs';
import { throws } from 'assert';

@Injectable()
export class TransacaoService {
 
  logger: Logger = new Logger(TransacaoService.name);
  conta: ContaDto;

  constructor(
    @Inject(TransacaoRepositorio)
    private transacaoRepository: TransacaoRepositorio,
    @Inject(ClientProxyRMQ)
    private clientProxyRMQ: ClientProxyRMQ,
  ) {}

  depositar(depositarDto: DepositarDto) {
    try {
      this.logger.log(`Comunicando deposito: ${JSON.stringify(depositarDto)}`);
      this.clientProxyRMQ.emit('depositar', depositarDto);
    } catch (error) {
      this.logger.log(`Error ao comunicar deposito ${error.message}`);
      throw new RpcException(error.erro);
    }
  }

  async cofirmarDepositar(depositarDto: DepositarDto) {
    try {
      this.logger.log(`Confirmando Deposito: ${JSON.stringify(depositarDto)}`);
      await this.transacaoRepository.criar(depositarDto);
    } catch (error) {
      this.logger.log(`Error ao confirmar deposito ${error.message}`);
      throw new RpcException(error.erro);
    }
  }

  async sacar(sacarDto: SacarDto): Promise<Transacao> {
    try {
      const valorSacadoDia = await this.valorSaqueNoDia(sacarDto.idConta);
      sacarDto.valorSacadoDia = valorSacadoDia;

      const sacarObs = this.clientProxyRMQ.send('sacar', sacarDto); 
      await lastValueFrom(sacarObs);
      return await this.transacaoRepository.criar(sacarDto);
    } catch (error) {
      this.logger.log(`Error ao processar saque ${error}`);
      throw new RpcException(error.error);
    }
  }

  private async valorSaqueNoDia(idConta): Promise<any> {
    const dataAtual = new Date();
    const dia = dataAtual.getDate();
    const mes = dataAtual.getMonth() + 1;
    const ano = dataAtual.getFullYear();
    let hojeZeroHora;
    if (mes < 10) hojeZeroHora = `${ano}-0${mes}-${dia} 00:00:00`;
    else hojeZeroHora = `${ano}-${mes}-${dia} 00:00:00`;
    try {
      const valor = await this.transacaoRepository.somatoriaValorSaqueDiario(
        idConta,
        hojeZeroHora,
      );
      return valor;
    } catch (error) {
      this.logger.log(
        `Error ao processar consultada de valor de saque no dia.`,
      );
      throw new RpcException(error.error);
    }
  }

  async listar(): Promise<Transacao[] | Transacao> {
    return this.transacaoRepository.listar();
  }

  async extrato(idConta: number): Promise<Transacao[]> {
    this.logger.log(`Processando extrato`);
    try {
      return await this.transacaoRepository.buscarPorId(idConta);
    } catch (error) {
      this.logger.log(`Error ao processar extrato`);
      throw new RpcException(error.error);
    }
  }

  async extratoPorPeriodo(
    extratoPorPeriodoDto: ExtratoPorPeriodoDto,
  ): Promise<Transacao[]> {
    try {
      const extrato: Transacao[] =
        await this.transacaoRepository.bucarPorPeriodo(
          extratoPorPeriodoDto.idConta,
          extratoPorPeriodoDto.dataInicial,
          extratoPorPeriodoDto.dataFinal,
        );
      return extrato;
    } catch (error) {
      this.logger.log(
        `Error ao processar extrato: ${JSON.stringify(extratoPorPeriodoDto)}`,
      );
      throw new RpcException(error.error);
    }
  }
}
