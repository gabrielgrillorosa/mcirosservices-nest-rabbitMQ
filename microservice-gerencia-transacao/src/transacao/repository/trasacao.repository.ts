import { RpcException } from '@nestjs/microservices';
import { Repository } from 'sequelize-typescript';
import { TipoTransacao, Transacao } from './../entity/transacao.entity';
import { ExtratoPorPeriodoDto } from '../dto/extratoPorPeriodoDto.dtos';
import { TransacaoModule } from './../transacao.module';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, Model } from 'sequelize';
import { DepositarDto } from '../dto/depositar.dto';
import sequelize from 'sequelize';
import { TransacaoDto } from '../dto/transacao.dto';
import { ExtratoDto } from '../dto/extrato.dto';
import { is } from 'sequelize/types/lib/operators';
import { isInt } from 'class-validator';

@Injectable()
export class TransacaoRepositorio {
  logger = new Logger(TransacaoRepositorio.name);

  constructor(
    @InjectModel(Transacao) private transacaoModel: typeof Transacao,
  ) {}

  async somatoriaValorSaqueDiario(
    IdConta: number,
    dataTransacao: Date,
  ): Promise<number> {
    return await this.transacaoModel
      .findAll({
        where: {
          idConta: IdConta,
          dataCriacao: {
            [Op.gte]: dataTransacao,
          },
          valor: {
            [Op.lte]: 0,
          },
        },
      })
      .then((transacoes) => {

        const valorSaques = transacoes.reduce((valorSaques, transacao) => {
          return (
            parseFloat(valorSaques.toString()) +
            parseFloat(transacao.valor.toString())
          );
        }, 0);
        return valorSaques;
      });
  }
  async buscar(transacaoDto: TransacaoDto): Promise<Transacao> {
    return await this.transacaoModel.findOne({
      where: { idConta: transacaoDto.idConta },
    });
  }

  async listar(): Promise<Transacao[] | Transacao> {
    return this.transacaoModel.findAll();
  }

  async criar(transacaoDto: TransacaoDto): Promise<Transacao> {
    this.logger.log('Criando Transacao:');
    try {
      const transacao = await this.transacaoModel.create(transacaoDto);
      this.logger.log(`Salvando Transacao ${JSON.stringify(transacao)}`);
      return await transacao.save();
    } catch (error) {
      this.logger.log(
        `Error ao Salvar Transacao: ${JSON.stringify(error.message)}`,
      );
      throw new RpcException(error.message);
    }
  }

  async buscarPorId(idConta: number): Promise<Transacao[]> {
    return await this.transacaoModel
      .findAll({ where: { idConta: idConta } })
      .then((transacoes: Transacao[]) => {

        return transacoes;
      });
  }

  async bucarPorPeriodo(
    idConta: number,
    dataInicial: Date,
    dataFinal: Date,
  ): Promise<Transacao[]> {
    return await this.transacaoModel
      .findAll({
        where: {
          idConta: idConta,
          dataCriacao: {
            [Op.between]: [dataInicial, dataFinal],
          },
        },
      })
      .then((transacoes: Transacao[]) => {
        return transacoes;
      });
  }
}
