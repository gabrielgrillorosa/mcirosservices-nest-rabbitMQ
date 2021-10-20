import { TransacaoRepositorio } from './repository/trasacao.repository';
import { ProxyRMQModule } from './../proxyrmq/proxyrmq.module';
import { Module } from '@nestjs/common';
import { TransacaoService } from './services/transacao.service';
import { TransacaoController } from './controllers/transacao.controller';
import { Transacao } from './entity/transacao.entity';
import { SequelizeModule } from '@nestjs/sequelize/dist/sequelize.module';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [SequelizeModule.forFeature([Transacao]),
    ProxyRMQModule,
  ],
  controllers: [TransacaoController],
  providers: [TransacaoService, TransacaoRepositorio],
})
export class TransacaoModule {}
