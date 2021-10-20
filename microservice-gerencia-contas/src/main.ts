import { Inject, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { config } from 'process';
import { AppModule } from './app.module';

async function bootstrap() {

  const configService: ConfigService = new ConfigService();
  const looger: Logger = new Logger('Main');

  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.RMQ,
    options: {
      urls: [
        `amqp://${configService.get<string>(
          'RABBITMQ_USER',
        )}:${configService.get<string>(
          'RABBITMQ_PASSWORD',
        )}@${configService.get<string>('RABBITMQ_URL')}`,
      ],
      queue: 'desafiodock',
      noAck: false,
    },
  });
  await app.listen();
}
bootstrap();
