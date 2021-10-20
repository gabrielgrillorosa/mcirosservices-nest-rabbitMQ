import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize/dist/sequelize.module';
import { Pessoa } from './pessoa.entity';
import { PessoasController } from './pessoas.controller';


@Module({
    imports: [SequelizeModule.forFeature([Pessoa])],
    controllers: [PessoasController],
})
export class PessoasModule {}
