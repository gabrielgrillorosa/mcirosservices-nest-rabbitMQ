import { IsNotEmpty, IsDecimal, IsNumber } from 'class-validator';
import { Is, IsNumeric } from 'sequelize-typescript';

export class DepositarDto {

  idConta: number;


  valor: number;


  limiteSaqueDiario: number;

}
