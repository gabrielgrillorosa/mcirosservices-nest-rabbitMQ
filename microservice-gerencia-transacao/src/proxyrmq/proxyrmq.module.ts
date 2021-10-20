import { ClientProxyRMQ } from './client-proxyrmq';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Module({
  providers: [ClientProxyRMQ],
  exports: [ClientProxyRMQ],
})
export class ProxyRMQModule {}
