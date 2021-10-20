import { IsNumber, IsNotEmpty, IsDecimal } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class DepositarDto {

  @IsNumber()
  @IsNotEmpty()
 @ApiProperty()
  idConta: number;

  @IsDecimal()
  @IsNotEmpty()
  @ApiProperty()
  valor: number;
}
