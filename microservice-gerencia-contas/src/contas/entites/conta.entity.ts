import { Pessoa } from './../../pessoas/pessoa.entity';
import {
  AutoIncrement,
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';

export enum ContaAtiva {
  ATIVA = 'true',
  BLOQUEADA = 'false',
}

@Table({
  tableName: 'contas',
  createdAt: 'dataCriacao',
  updatedAt: 'updatedAt',
})
export class Conta extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.BIGINT, allowNull: false })
  idConta: number;

  @ForeignKey(() => Pessoa)
  @Column({ type: DataType.BIGINT, allowNull: false })
  idPessoa: number;

  @BelongsTo(() => Pessoa, { foreignKey: 'idPessoa' })
  pessoa: Pessoa;

  @Column({ allowNull: false, type: DataType.DECIMAL(25, 2) })
  saldo: number;

  @Column({ allowNull: false, type: DataType.DECIMAL(25, 2) })
  limiteSaqueDiario: number;

  @Column({ allowNull: false })
  tipoConta: number;

  @Column({ allowNull: false, type: DataType.BOOLEAN })
  flagAtivo: boolean;


}
