import { Module } from '@nestjs/common';
import { ProxyRMQModule } from 'src/proxyrmq/proxyrmq.module';
import { ContaController } from './controller/conta.controller';

@Module({
  imports: [ProxyRMQModule],
  controllers: [ContaController],
})
export class ContaModule {}
