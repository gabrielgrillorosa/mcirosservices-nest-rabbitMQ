import { Observable } from 'rxjs';
/* eslint-disable prettier/prettier */
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from '@nestjs/microservices/external/nats-client.interface';
import { send } from 'process';

@Injectable()
export class ClientProxyRMQ {

  private clientProxy:ClientProxy ;
  constructor(private configService: ConfigService) {    
    
      this.clientProxy = ClientProxyFactory.create({
        transport: Transport.RMQ,
        options: {
          urls: [
            `amqp://${this.configService.get<string>(
              'RABBITMQ_USER',
            )}:${this.configService.get<string>(
              'RABBITMQ_PASSWORD',
            )}@${this.configService.get<string>('RABBITMQ_URL')}`,
          ],
          queue: 'desafiodock',
          noAck: false,
        },
      });
    }
  


  send(pattern, data): Observable<any>{
    return this.clientProxy.send(pattern,data);
  }

  emit(pattern, data): Observable<any>{
    return this.clientProxy.emit(pattern,data);
  }
  
  getClientProxyRMQInstance(): ClientProxy {
    
    return ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [
          `amqp://${this.configService.get<string>(
            'RABBITMQ_USER',
          )}:${this.configService.get<string>(
            'RABBITMQ_PASSWORD',
          )}@${this.configService.get<string>('RABBITMQ_URL')}`,
        ],
        queue: 'desafiodock',
      },
    });
  }
}
