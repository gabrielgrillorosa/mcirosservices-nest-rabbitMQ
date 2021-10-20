import { Observable } from 'rxjs';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { Injectable, Controller } from '@nestjs/common';
import { emit } from 'process';

@Injectable()
export class ClientProxyRMQ {
  private readonly clientProxy: ClientProxy;
  
  constructor(){
    this.clientProxy = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://guest:guest@amqp:5672'],
        queue: 'desafiodock',
      },
    })
  }

  send(pattern, data): Observable<any>{
    return this.clientProxy.send(pattern,data);
  }
  
  emit(pattern, data): Observable<any>{
    return this.clientProxy.emit(pattern,data);
  }
  
}
