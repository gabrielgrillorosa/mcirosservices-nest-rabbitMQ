import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsArray, ArrayMinSize, IsDecimal, IsBoolean, isDecimal, isNumber, IsNumber, isNotEmpty } from 'class-validator';

export class CriarContaDto {

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
   readonly idPessoa: number;

  @IsNotEmpty()
  @IsDecimal()
  @ApiProperty()
  readonly saldo: number;

  @IsNotEmpty()
  @IsBoolean()
  @ApiProperty()
  readonly flagAtivo: false;

  @IsNotEmpty()
  @IsDecimal()
  @ApiProperty()
  readonly limiteSaqueDiario: number;
  
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  readonly tipoConta: number;
}
