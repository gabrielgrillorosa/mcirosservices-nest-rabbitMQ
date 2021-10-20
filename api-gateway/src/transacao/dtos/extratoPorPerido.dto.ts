import { IsDate, IsInt, IsNotEmpty, IsNumber } from 'class-validator';

export class ExtratoPorPeriodoDto {
  @IsNotEmpty()
  @IsNumber()
  idConta: number;

  @IsNotEmpty()
  @IsDate()
  dataInicial: Date;

  @IsNotEmpty()
  @IsDate()
  dataFinal: Date;
}
