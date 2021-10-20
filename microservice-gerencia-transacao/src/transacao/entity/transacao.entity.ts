import {
  AutoIncrement,
  Column,
  DataType,
  PrimaryKey,
  Table,
  Model,
} from 'sequelize-typescript';

export enum TipoTransacao {
  SAQUE = 'saque',
  DEPOSITO = 'deposito',
}

@Table({
  tableName: 'transacoes',
  createdAt: 'dataCriacao',
  updatedAt: false,
})
export class Transacao extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.BIGINT, allowNull: false })
  idTransacao: number;

  @Column({ allowNull: false })
  idConta: number;

  @Column({ allowNull: false, type: DataType.DECIMAL(25, 2) })
  valor: number;

  @Column({ type: DataType.DATE })
  dataCriacao: Date;

  /*
  *  Nao implentado por nao foi acordado com cliente, sera considerado valor > 0 deposito < saque
  *
  *@Column({ allowNull: false })
  *tipoTransacao: TipoTransacao;
  *
  */
}
