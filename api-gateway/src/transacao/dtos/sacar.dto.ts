import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsNotEmpty, IsDecimal } from 'class-validator';
import { DepositarDto } from '../dtos/depositar.dto';
export class SacarDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  idConta: number;

  @IsDecimal()
  @IsNotEmpty()
  @ApiProperty()
  valor: number;
}
