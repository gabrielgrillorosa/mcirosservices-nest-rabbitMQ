import { Module } from '@nestjs/common';
import { ProxyRMQModule } from '../proxyrmq/proxyrmq.module';
import { ContasController } from './controller/contas.controller';
import { Conta } from './entites/conta.entity';
import { SequelizeModule } from '@nestjs/sequelize/dist/sequelize.module';
import { ContasService } from './services/contas.service';
import { ContasRepository } from './repository/contas.repository';

@Module({
  imports: [SequelizeModule.forFeature([Conta]), ProxyRMQModule],
  controllers: [ContasController],
  providers: [ContasService, ContasRepository],
})
export class ContasModule {}
