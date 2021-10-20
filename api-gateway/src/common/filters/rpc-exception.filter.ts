import { Catch, RpcExceptionFilter, ArgumentsHost, Logger } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { RpcException } from '@nestjs/microservices';

@Catch(RpcException)
export class ExceptionFilter implements RpcExceptionFilter<RpcException> {
     
  private readonly logger = new Logger(ExceptionFilter.name);
  catch(exception: RpcException, host: ArgumentsHost): Observable<any> {

    this.logger.error(`${JSON.stringify(exception.getError())}`);    
    return throwError(exception.getError());
  }
}