import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsArray, ArrayMinSize, IsDecimal, IsBoolean, isDecimal, isNumber, IsNumber, isNotEmpty } from 'class-validator';

export class ConsultarSaldoDto {

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
   readonly idConta: number;
}