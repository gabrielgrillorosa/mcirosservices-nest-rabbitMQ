import { Module } from '@nestjs/common';
import { ProxyRMQModule } from './proxyrmq/proxyrmq.module';
import { ConfigModule } from '@nestjs/config';
import { TransacaoModule } from './transacao/transacao.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize';

@Module({
  imports: [
      SequelizeModule.forRoot({
      dialect: 'postgres',
      port: 5432,
      username: 'dock',
      password: 'dock',
      host: 'db-gt',
      database: 'gerenciaTransacao',
      models: ['Transacao'],
      autoLoadModels: true,
      synchronize: false,
      sync: {
        alter: false,
        force: false,
      },
    }),
    TransacaoModule,
    ProxyRMQModule,
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
