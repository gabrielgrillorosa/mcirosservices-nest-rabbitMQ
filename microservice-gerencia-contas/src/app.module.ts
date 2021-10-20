import { ProxyRMQModule } from './proxyrmq/proxyrmq.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ContasModule } from './contas/contas.module';
import { PessoasModule } from './pessoas/pessoas.module';
import { SequelizeModule } from '@nestjs/sequelize/dist/sequelize.module';


@Module({
  imports: [
    ContasModule,
    SequelizeModule.forRoot({
      dialect: 'postgres',
      port: 5432,
      username: 'dock',
      password: 'dock',
      host: 'db-gc',
      database: 'gerenciaContas',
      models: ['Conta'],
      autoLoadModels: true,
      synchronize: false,
      sync: {
        alter: false,
        force: false,
      },
    }),
    PessoasModule,
    ProxyRMQModule,
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  providers: [],
})
export class AppModule {}
