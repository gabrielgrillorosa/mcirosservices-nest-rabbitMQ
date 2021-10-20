import { Module } from '@nestjs/common';
import { ClientProxyRMQ } from '../proxyrmq/services/client-proxyrmq';

@Module({
  providers: [ClientProxyRMQ],
  exports: [ClientProxyRMQ],
})
export class ProxyRMQModule {}
