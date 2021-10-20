import { IsNotEmpty, IsDecimal, IsNumber } from 'class-validator';
import { Is, IsNumeric } from 'sequelize-typescript';

export class TransacaoDto {

  idConta: number;

  valor: number;
}
