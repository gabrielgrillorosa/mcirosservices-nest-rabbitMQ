import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Observable } from 'rxjs';


@Injectable()
export class ClientProxyRMQ {

  constructor(private configService: ConfigService) { }  


  send(pattern, data): Observable<any>{

    return this.getClientProxyRMQInstance().send(pattern,data);
  }

  emit(pattern, data): Observable<any>{
    return this.getClientProxyRMQInstance().emit(pattern,data);
  }
  
 private getClientProxyRMQInstance(): ClientProxy {
    
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
