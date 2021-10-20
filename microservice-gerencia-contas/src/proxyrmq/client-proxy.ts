import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Observable } from 'rxjs';

@Injectable()
export class ClientProxyGerenciaConta {
  private readonly clientProxy: ClientProxy;

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

  public send(pattern, data): Observable<any> {
    return this.clientProxy.send(pattern,data);
  }
  
  public emit(pattern, data): Observable<any> {
    return this.clientProxy.send(pattern,data);
  }
}
