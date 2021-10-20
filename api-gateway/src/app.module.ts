import { ContaModule } from './conta/conta.module';
import { Module } from '@nestjs/common';
import { ProxyRMQModule } from './proxyrmq/proxyrmq.module';
import { TransacaoModule } from './transacao/transacao.module';
@Module({
  imports: [ProxyRMQModule, ContaModule, TransacaoModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
