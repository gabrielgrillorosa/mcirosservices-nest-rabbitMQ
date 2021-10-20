import { MessageErrorDto } from './../dtos/mensag.padrao.dto';
import { RpcException } from '@nestjs/microservices';
import { SacarDto } from '../dtos/sacar.Dto';
import { Conta } from '../entites/conta.entity';
import { DepositarDto } from '../dtos/depositar.dtos';
import { CriarContaDto } from '../dtos/criarConta.dtos';
import { HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { ContasRepository } from '../repository/contas.repository';

@Injectable()
export class ContasService {
  private readonly logger: Logger = new Logger(ContasService.name);

  constructor(
    @Inject(ContasRepository)
    private contasRepository: ContasRepository,
  ) {}

  async criarConta(criarContatoDto: CriarContaDto): Promise<Conta> {
    this.logger.log(`Criando Conta: ${JSON.stringify(criarContatoDto)}`);
    try {
      const conta: Conta = await this.contasRepository.criarConta(
        criarContatoDto,
      );
      return conta;
    } catch (error) {
      this.logger.log(`Error ao Cadastra Conta ${error.message}`);
      const messageError: MessageErrorDto = new MessageErrorDto();
      messageError.message = error.message;
      messageError.status = HttpStatus.INTERNAL_SERVER_ERROR;
      throw new RpcException(messageError);
    }
  }

  async listarContas(): Promise<Conta[]> {
    return await this.contasRepository.listarContas();
  }

  async consultarConta(idConta: number): Promise<Conta> {
    return await this.contasRepository.buscarPorId(idConta);
  }

  async bloquearConta(idConta: number): Promise<Conta> {
    let contaEncontrada: Conta;
    try {
      this.logger.log(`Bloqueando conta ${idConta}`);
      contaEncontrada = await this.contasRepository.buscarPorId(idConta);
    } catch (error) {
      this.logger.log(error.message);
      const messageError: MessageErrorDto = new MessageErrorDto();
      messageError.message = error.message;
      messageError.status = HttpStatus.INTERNAL_SERVER_ERROR;
      throw new RpcException(messageError);
    }
    if (!contaEncontrada) {
      const messageError: MessageErrorDto = new MessageErrorDto();
      messageError.message = 'Conta não Encontrado.';
      messageError.status = HttpStatus.NOT_FOUND;
      throw new RpcException(messageError);
    }
    return await this.contasRepository.atualiarStatus(contaEncontrada, false);
  }

  async consultarSaldo(idConta: number): Promise<number> {
    let contaEncontrada: Conta;

    try {
      contaEncontrada = await this.contasRepository.buscarPorId(idConta);
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`);
      const messageError: MessageErrorDto = new MessageErrorDto();
      messageError.message = error.message;
      messageError.status = HttpStatus.INTERNAL_SERVER_ERROR;
      throw new RpcException(messageError);
    }
    if (!contaEncontrada) {
      this.logger.log(`Conta não encontrada`);
      const messageError: MessageErrorDto = new MessageErrorDto();
      messageError.message = 'Conta não Encontrado.';
      messageError.status = HttpStatus.NOT_FOUND;
      throw new RpcException(messageError);
    }
    return contaEncontrada.saldo;
  }

  async depositar(compensarDepositarDto: DepositarDto): Promise<Conta> {
    let contaEncontrada: Conta;

    try {
      contaEncontrada = await this.contasRepository.buscarPorId(
        compensarDepositarDto.idConta,
      );
    } catch (error) {
      this.logger.error(`Error ao realizar deposito.${error.message}`);
      const messageError: MessageErrorDto = new MessageErrorDto();
      messageError.message = error.message;
      messageError.status = HttpStatus.INTERNAL_SERVER_ERROR;
      throw new RpcException(messageError);
    }

    if (!contaEncontrada) {
      this.logger.log(
        `Error ao realizar deposito na conta ${contaEncontrada.idConta}. Conta não encontrada.}`,
      );
      const messageError: MessageErrorDto = new MessageErrorDto();
      messageError.message = 'Conta não Encontrada.';
      messageError.status = HttpStatus.NOT_FOUND;
      throw new RpcException(messageError);
    }

    const saldoAtual = parseFloat(contaEncontrada.saldo.toString());
    const valorDeposito = Math.abs(
      parseFloat(compensarDepositarDto.valor.toString()),
    );
    const novoSaldo = saldoAtual + valorDeposito;

    try {
      this.logger.log(
        `Realizando depósito no valor de ${valorDeposito} na conta ${contaEncontrada.idConta}`,
      );
      contaEncontrada.saldo = novoSaldo;
      return await contaEncontrada.save();
    } catch (error) {
      this.logger.error(`Erro ao processar saque: ${error.message}`);
      const messageError: MessageErrorDto = new MessageErrorDto();
      messageError.message = error.message;
      messageError.status = HttpStatus.INTERNAL_SERVER_ERROR;
      throw new RpcException(messageError);
    }
  }

  async sacar(compensarSaqueDto: SacarDto): Promise<Conta> {
    let contaEncontrada: Conta;
    try {
      contaEncontrada = await this.contasRepository.buscarPorId(
        compensarSaqueDto.idConta,
      );
    } catch (error) {
      this.logger.log(
        `Error ao realizar saque na conta ${contaEncontrada.idConta}. Conta não encontrada. ${error.message}`,
      );
      const messageError: MessageErrorDto = new MessageErrorDto();
      messageError.message = error.message;
      messageError.status = HttpStatus.INTERNAL_SERVER_ERROR;
      throw new RpcException(messageError);
    }

    if (!contaEncontrada) {
      this.logger.error('Erro ao processar saque.');
      const messageError: MessageErrorDto = new MessageErrorDto();
      messageError.message = 'Conta não encontrada.';
      messageError.status = HttpStatus.NOT_FOUND;
      throw new RpcException(messageError);
    }

    const saldoAtual = parseFloat(contaEncontrada.saldo.toString());
    const valorSaquDia = Math.abs(
      parseFloat(compensarSaqueDto.valorSacadoDia.toString()),
    );
    const valorSaque = Math.abs(parseFloat(compensarSaqueDto.valor.toString()));
    const limiteSaqueDiario = contaEncontrada.limiteSaqueDiario;

    if (!(limiteSaqueDiario >= valorSaquDia + valorSaque)) {
      this.logger.log(`Saque não realisado por exceder limite de diario.`);
      const messageError: MessageErrorDto = new MessageErrorDto();
      messageError.message = 'Limite diário de saque excedido.';
      messageError.status = HttpStatus.UNAUTHORIZED;
      throw new RpcException(messageError);
    } else if (!(saldoAtual >= valorSaque)) {
      this.logger.log(`Saldo insuficiente.`);
      const messageError: MessageErrorDto = new MessageErrorDto();
      messageError.message = 'Saldo Insuficiente.';
      messageError.status = HttpStatus.UNAUTHORIZED;
      throw new RpcException(messageError);
    }

    try {
      this.logger.log(
        `Realizando saque no valor de ${valorSaquDia} na conta ${contaEncontrada.idConta}`,
      );
      contaEncontrada.saldo = saldoAtual - valorSaque;
      return await contaEncontrada.save();
    } catch (error) {
      this.logger.log('Error ao processar saque ${erro.messageError} ');
      const messageError: MessageErrorDto = new MessageErrorDto();
      messageError.message = error.message;
      messageError.status = HttpStatus.INTERNAL_SERVER_ERROR;
      throw new RpcException(messageError);
    }
  }
}
