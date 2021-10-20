import { MessageErrorDto } from './../../conta/dtos/messageError.dto';

import { isNotEmpty } from 'class-validator';
import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    if (exception instanceof HttpException) {
      const status = exception.getStatus();

      console.log(`exception: ${JSON.stringify(exception)}`);
      console.log(`status getError: ${JSON.stringify(status)}`);

      const message =
        exception instanceof HttpException
          ? exception.getResponse()
          : exception;

      this.logger.error(
        `Http Status: ${status} Error Message: ${JSON.stringify(message)} `,
      );

      response.status(status).json({
        timestamp: new Date().toISOString(),
        path: request.url,
        error: message,
      });
    } else {
      /* faz se necessário a validação do formato da mensagem através de
       * expressã regular para evitar falhar de segmentaçao de memógia
       *
       */
      const regexPatern = '{ "message":"*" "status":/d/d/d }';
      const objetoRegex = new RegExp(regexPatern, 'g');
      const result = objetoRegex.exec(new String(exception).toString());

      const messageError: MessageErrorDto = new MessageErrorDto();
      const novoObjeto = Object.fromEntries(
        Object.entries(exception).filter(([key, val]) => {
          if (key == 'message') messageError.message = val;
          if (key == 'status') messageError.status = val;
        }),
      );
      this.logger.error(
        `Http Status: ${messageError.status} Error Message: ${JSON.stringify(
          messageError.message,
        )} )`,
      );
      this.logger.error(`Http Status: ${JSON.stringify(messageError)} )`);

      if (messageError.status > 0 && messageError.message != null) {
        response.status(messageError.status).json({
          timestamp: new Date().toISOString(),
          path: request.url,
          error: messageError.message,
        });
      } else
        response.status(500).json({
          timestamp: new Date().toISOString(),
          path: request.url,
          error: exception,
        });
    }
  }
}
