import { IsNotEmpty, IsNumber } from 'class-validator';

export class ResultadoTransacaoDto {
  idConta: number;
  mensagem: string;
  status: number;
}
