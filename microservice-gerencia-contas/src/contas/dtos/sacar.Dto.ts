import { Pessoa } from 'src/pessoas/pessoa.entity';


export class SacarDto{
  idConta:number;
   valor:number;
  valorSacadoDia: number;
  pessoa: Pessoa;

}