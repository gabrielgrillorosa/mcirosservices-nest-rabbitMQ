import { Module } from '@nestjs/common';
import { ClientProxyGerenciaConta } from './client-proxy';

@Module({
  providers: [ClientProxyGerenciaConta],
  exports: [ClientProxyGerenciaConta],
})
export class ProxyRMQModule {}
