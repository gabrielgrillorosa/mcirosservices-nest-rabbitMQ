
import {
  AutoIncrement,
  Column,
  DataType,
  HasOne,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { Conta } from "../contas/entites/conta.entity"

@Table({
  tableName: 'pessoa',
  createdAt: 'dataCriacao',
  updatedAt: 'updated_at',
})
export class Pessoa extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.BIGINT, allowNull: false })
  idPessoa: number;

  @HasOne(() => Conta)
  conta: Conta;

  @Column({ allowNull: false, type: DataType.STRING(50) })
  nome: string;

  @Column({ allowNull: false, type: DataType.STRING(11) })
  cpf: string;

  @Column({ allowNull: false, type: DataType.DATE() })
  dataNascimento: Date;
}
