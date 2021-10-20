import { PartialType } from '@nestjs/mapped-types';
import { TransacaoDto } from './transacao.dto';

export class SacarDto extends TransacaoDto {
    valorSacadoDia: number;
}
