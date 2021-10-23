import { Pessoa } from './../../pessoas/pessoa.entity';
import { SacarDto } from '../dtos/sacar.Dto';
import { Conta } from '../entites/conta.entity';
import { CriarContaDto } from '../dtos/criarConta.dtos';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class ContasRepository {
  private readonly logger: Logger = new Logger(ContasRepository.name);

  constructor(
    @InjectModel(Conta)
    private contaModel: typeof Conta,
  ) {}

  async criarConta(criarContatoDto: CriarContaDto): Promise<Conta> {
    this.logger.log(`Criando Conta: ${JSON.stringify(criarContatoDto)}`);
    return await this.contaModel.create(criarContatoDto);
  }

  async listarContas(): Promise<Conta[]> {
    this.logger.log(`Listando Contas:`);
    return await this.contaModel.findAll({ include: { model: Pessoa } });
  }

  async atualiarStatus(conta: Conta, flagAtivo: boolean): Promise<Conta> {
    this.logger.log(
      `${flagAtivo} Atualizando Status: ${JSON.stringify(conta.idConta)}`,
    );   
    conta.flagAtivo = flagAtivo;
    return await conta.save();
  }

  async buscarPorId(idConta: number): Promise<Conta> {
    this.logger.log(`Procurando conta: ${JSON.stringify(idConta)}`);
    return await this.contaModel.findOne({
      where: { idConta: idConta },
      include: { model: Pessoa },
    });
  }
}
