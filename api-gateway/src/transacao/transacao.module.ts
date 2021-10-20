import { TransacaoController } from './controllers/transacao.controller';
import { Module } from '@nestjs/common';
import { ProxyRMQModule } from '../proxyrmq/proxyrmq.module';

@Module({
  imports: [ProxyRMQModule],
  controllers: [TransacaoController],
})
export class TransacaoModule {}
