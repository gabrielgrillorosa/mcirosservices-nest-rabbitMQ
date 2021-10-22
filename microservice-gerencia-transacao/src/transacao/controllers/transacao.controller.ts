import { DepositarDto } from '../dto/depositar.dto';
import { SacarDto } from '../dto/sacarDto';
import { Transacao } from '../entity/transacao.entity';
import { Controller, HttpCode, HttpStatus, Logger, Next } from '@nestjs/common';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
  RpcException,
} from '@nestjs/microservices';
import { TransacaoService } from '../services/transacao.service';
import { ExtratoPorPeriodoDto } from '../dto/extratoPorPeriodoDto.dtos';
import { Subscriber } from 'rxjs';
import { ResultadoTransacaoDto } from '../dto/resultadoTransacao.dto';

/* 

  código de erros considerados não impactantes na que tange a garantir a entrega da mensagem
*/
const ackErrors: string[] = ['E11000'];

@Controller()
export class TransacaoController {
  limiteSaqueDiario: number;
  logger: Logger = new Logger(TransacaoController.name);
  constructor(private readonly transacaoService: TransacaoService) {}

  @MessagePattern('realizar-saque')
  async sacar(
    @Payload() sacarDto: SacarDto,
    @Ctx() context: RmqContext,
  ): Promise<Transacao> {
    this.logger.log(`Saque: ${JSON.stringify(sacarDto)}`);
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    try {
      const transacao: Transacao = await this.transacaoService.sacar(sacarDto);
      await channel.ack(originalMsg);
      return transacao;
    } catch (error) {
      this.logger.log(`error: ${JSON.stringify(error.error)}`);
      const filterAckError = ackErrors.filter((ackError) =>
        error.message.includes(ackError),
      );

      if (filterAckError.length > 0) {
        await channel.ack(originalMsg);
      }
      throw new RpcException(error.error);     
    }
  }

  @EventPattern('confirmar-deposito')
  async confirmarDepositar(
    @Payload() depositarDto: DepositarDto,
    @Ctx() context: RmqContext,
  ) {
    this.logger.log(`Confirmação de Deposito: ${JSON.stringify(depositarDto)}`);
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    try {
      await this.transacaoService.cofirmarDepositar(depositarDto);
      await channel.ack(originalMsg);

   } catch (error) {
      this.logger.log(`error: ${JSON.stringify(error.message)}`);
      const filterAckError = ackErrors.filter((ackError) =>
        error.message.includes(ackError),
      );

      if (filterAckError.length > 0) {
        await channel.ack(originalMsg);
      }
    }
  }

  @MessagePattern('realizar-deposito')
  async depositar(
    @Payload() depositarDto: DepositarDto,
    @Ctx() context: RmqContext,
  ) {
    this.logger.log(`Deposito: ${JSON.stringify(depositarDto)}`);
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    try {
      this.transacaoService.depositar(depositarDto);
      await channel.ack(originalMsg);
     } catch (error) {
      this.logger.log(`error: ${JSON.stringify(error.message)}`);
      const filterAckError = ackErrors.filter((ackError) =>
        error.message.includes(ackError),
      );

      if (filterAckError.length > 0) {
        await channel.ack(originalMsg);
      }
    }
  }

  @MessagePattern('extrato')
  async extrato(
    @Payload() idConta: number,
    @Ctx() context: RmqContext,
  ): Promise<Transacao[] | Transacao> {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    try {
      this.logger.log(`Extrato: ${JSON.stringify(idConta)}`);
      const extrato = await this.transacaoService.extrato(idConta);
      await channel.ack(originalMsg);
      return extrato;
    } catch (error) {
      this.logger.log(`error: ${JSON.stringify(error.message)}`);
      const filterAckError = ackErrors.filter((ackError) =>
        error.message.includes(ackError),
      );

      if (filterAckError.length > 0) {
        await channel.ack(originalMsg);
      }
      throw new RpcException(error.error);
    }
  }

  @MessagePattern('extrato-por-periodo')
  async extratoPorPeriodo(
    @Payload() extratoPorPeriodoDto: ExtratoPorPeriodoDto,
    @Ctx() context: RmqContext,
  ): Promise<Transacao[] | Transacao> {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    try {
      this.logger.log(`Extrato: ${JSON.stringify(extratoPorPeriodoDto.idConta)}`);
      const extrato: Transacao[] = await this.transacaoService.extratoPorPeriodo(
        extratoPorPeriodoDto,
      );
      return extrato;
    } catch (error) {
      this.logger.log(`error: ${JSON.stringify(error.error)}`);
      const filterAckError = ackErrors.filter((ackError) =>
      error.message.includes(ackError),
    );

    if (filterAckError.length > 0) {
      await channel.ack(originalMsg);
    }
    throw new RpcException(error.error);
    }
  }
}
