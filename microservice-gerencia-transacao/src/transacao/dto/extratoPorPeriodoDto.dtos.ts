import { IsDate, IsInt, IsNotEmpty, IsNumber } from 'class-validator';

export class ExtratoPorPeriodoDto {

  idConta: number;

 
  dataInicial: Date;

 
  dataFinal: Date;
}
