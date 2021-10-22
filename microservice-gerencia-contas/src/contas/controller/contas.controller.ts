import { DepositarDto } from './../dtos/depositar.dtos';
import { CriarContaDto } from './../dtos/criarConta.dtos';
import { Inject, Logger, HttpStatus } from '@nestjs/common';
import { ContasService } from '../services/contas.service';
import { Conta } from '../entites/conta.entity';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
  RpcException,
} from '@nestjs/microservices';
import { Controller } from '@nestjs/common';
import { SacarDto } from '../dtos/sacar.Dto';
import { throws } from 'assert';

const ackErrors: string[] = ['E11000'];
/**
 * Usado para tirar da fila mensagens que não precisam ser lidas novamente.
 * Exemplo: Erro de chave duplicada. Ou seja a mensagem já foi lida.
 *
 * */
@Controller()
export class ContasController {
  @Inject()
  private readonly contasService: ContasService;

  logger = new Logger(ContasController.name);

  @EventPattern('depositar')
  async Depositar(
    @Payload() depositarDto: DepositarDto,
    @Ctx() context: RmqContext,
  ){
    this.logger.log(`Depositar: ${JSON.stringify(depositarDto)}`);

    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    try {
      await this.contasService.depositar(depositarDto);
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

  @MessagePattern('sacar')
  async compensarSaque(
    @Payload() compensarSaqueDto: SacarDto,
    @Ctx() context: RmqContext,
  ): Promise<Conta> {
    this.logger.log(`Compensar Saque: ${JSON.stringify(compensarSaqueDto)}`);

    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    try {
      const conta: Conta = await this.contasService.sacar(compensarSaqueDto);
      await channel.ack(originalMsg);
      return conta;
    } catch (error) {
      const filterAckError = ackErrors.filter((ackError) =>
        error.message.includes(ackError),
      );

      if (filterAckError.length > 0) {
        await channel.ack(originalMsg);
      }
      this.logger.log(`${JSON.stringify(error.error)}`);
  
      throw new RpcException(error);
    }
  }

  @MessagePattern('criar-conta')
  async criarConta(
    @Payload() criarContaDto: CriarContaDto,
    @Ctx() context: RmqContext,
  ): Promise<Conta> {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    try {
      this.logger.log(`Criar Conta: ${JSON.stringify(criarContaDto)}`);
      const conta = await this.contasService.criarConta(criarContaDto);
      await channel.ack(originalMsg);
      this.logger.log(
        `Conta Criado com Sucesso: ${JSON.stringify(criarContaDto)}`,
      );
      return conta;
    } catch (error) {
      this.logger.log(`error: ${JSON.stringify(error.message)}`);
      const filterAckError = ackErrors.filter((ackError) =>
        error.message.includes(ackError),
      );
      if (filterAckError.length > 0) {
        await channel.ack(originalMsg);
      }
      this.logger.log(`${JSON.stringify(error.error)}`);
      throw new RpcException(error.error);
    }
  }

  @MessagePattern('get-conta')
  async getConta(
    @Payload() idConta: number,
    @Ctx() context: RmqContext,
  ): Promise<Conta> {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    try {
      this.logger.log(`Buncado dados da conta ${idConta}`);
      const conta: Conta = await this.contasService.consultarConta(idConta);
      await channel.ack(originalMsg);
      return conta;
    } catch (error) {
      const filterAckError = ackErrors.filter((ackError) =>
        error.message.includes(ackError),
      );
      if (filterAckError.length > 0) {
        await channel.ack(originalMsg);
      }

      throw new RpcException(error);
    }
  }

  @MessagePattern('consutlar-saldo')
  async consutlSaldo(
    @Payload() idConta: number,
    @Ctx() context: RmqContext,
  ): Promise<number> {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    try {
      this.logger.log(`Conslutando Saldo conta ${idConta}`);
      const saldo: number = await this.contasService.consultarSaldo(idConta);
      await channel.ack(originalMsg);
      return saldo;
    } catch (error) {
      const filterAckError = ackErrors.filter((ackError) =>
        error.message.includes(ackError),
      );
      if (filterAckError.length > 0) {
        await channel.ack(originalMsg);
      }
      this.logger.log(`${JSON.stringify(error.error)}`);
      throw new RpcException(error.error);
    }
  }

  @MessagePattern('bloquear-conta')
  async bloquear(
    @Payload() idConta: number,
    @Ctx() context: RmqContext,
  ): Promise<Conta> {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    try {
      const bloquearConta: Conta = await this.contasService.bloquearConta(
        idConta,
      );
      await channel.ack(originalMsg);
      return bloquearConta;
    } catch (error) {
      this.logger.log(`error: ${JSON.stringify(error.message)}`);
      const filterAckError = ackErrors.filter((ackError) =>
        error.message.includes(ackError),
      );

      if (filterAckError.length > 0) {
        await channel.ack(originalMsg);
      }
      this.logger.log(`${JSON.stringify(error.error)}`);
      throw new RpcException(error.error);
    }
  }

  @MessagePattern('get-saldo')
  async consultarSaldo(
    @Payload() idConta: number,
    @Ctx() context: RmqContext,
  ): Promise<number> {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    try {
      const saldo = await this.contasService.consultarSaldo(idConta);
      await channel.ack(originalMsg);
      return saldo;
    } catch (error) {
      this.logger.log(`error: ${JSON.stringify(error.message)}`);
      const filterAckError = ackErrors.filter((ackError) =>
        error.message.includes(ackError),
      );

      if (filterAckError.length > 0) {
        await channel.ack(originalMsg);
      }
      this.logger.log(`${JSON.stringify(error.error)}`);
      throw new RpcException(error.error);
    }
  }

  @MessagePattern('consultar-contas')
  async consultarConta(@Ctx() context: RmqContext): Promise<Conta[]> {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    try {
      this.logger.log(`Consultando Contas.`);
      const contas = this.contasService.listarContas();
      await channel.ack(originalMsg);
      return contas;
    } catch (error) {
      this.logger.log(`error: ${JSON.stringify(error.message)}`);
      const filterAckError = ackErrors.filter((ackError) =>
        error.message.includes(ackError),
      );

      if (filterAckError.length > 0) {
        await channel.ack(originalMsg);
      }
      this.logger.log(`${JSON.stringify(error.error)}`);
      throw new RpcException(error.error);
    }
  }
}
