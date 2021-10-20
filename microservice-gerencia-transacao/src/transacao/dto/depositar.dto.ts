import { TransacaoDto } from './transacao.dto';
import { IsNotEmpty, IsDecimal, IsNumber } from 'class-validator';
import { Is, IsNumeric } from 'sequelize-typescript';

export class DepositarDto extends TransacaoDto{

}
