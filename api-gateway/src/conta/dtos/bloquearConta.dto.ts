import { IsString, IsNotEmpty, IsArray, ArrayMinSize, IsDecimal, IsBoolean, isDecimal, isNumber, IsNumber, isNotEmpty } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';
export class BloquearContaDto {

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
   readonly idConta: number;
}