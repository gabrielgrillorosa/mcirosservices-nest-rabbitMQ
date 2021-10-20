import { IsNumber, IsNotEmpty } from 'class-validator';
export class ExtratoDto{  
    @IsNumber()
    @IsNotEmpty()
    idConta: number;
  }
  