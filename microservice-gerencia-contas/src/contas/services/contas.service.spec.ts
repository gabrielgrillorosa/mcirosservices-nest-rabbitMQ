import { SacarDto } from './../dtos/sacar.Dto';
import { RpcException } from '@nestjs/microservices';
import { PessoasModule } from './../../pessoas/pessoas.module';


import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { CriarContaDto } from '../dtos/criarConta.dtos';
import { Conta } from '../entites/conta.entity';
import { ContasModule } from '../contas.module';
import { ContasRepository } from '../repository/contas.repository';
import { ContasService } from '../services/contas.service';
import { SequelizeModule } from '@nestjs/sequelize/dist/sequelize.module';
import { Pessoa } from '../../pessoas/pessoa.entity';
import { ProxyRMQModule } from '../../proxyrmq/proxyrmq.module';
import { ClientProxyRMQ } from '../../proxyrmq/client-proxy';
import * as fs from 'fs';

describe('ContasService', () => {
  let contasService;
  let contsRepository;
  let clientProxyRMQ ;

  const mockClientProxy = () => ({
    send: jest.fn(),
    emit: jest.fn(),
  })

  const mockContsRepository = () => ({
    criarConta: jest.fn(),
    buscarPorId: jest.fn(),
    atualizarStatus: jest.fn(),
    listarContas: jest.fn(),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        SequelizeModule.forRoot({
          dialect: 'postgres',
          port: 5434,
          username: 'dock',
          password: 'dock',
          host: 'localhost',
          database: 'gerenciaContas',
          models: ['Conta', 'Pessoa'],
          autoLoadModels: true,
          synchronize: false,
          sync: {
            alter: false,
            force: false,
          },
        }),
        ContasModule,
        PessoasModule,
        ProxyRMQModule,
        SequelizeModule.forFeature([Conta, Pessoa]),
        ConfigModule.forRoot({ isGlobal: true }),
      ],
      providers: [
        ContasService,
        {
          provide: ClientProxyRMQ,
          useFactory: mockClientProxy,
        },
        {
          provide: ContasRepository,
          useFactory: mockContsRepository,
        },
      ],
    }).compile();

    contsRepository = await module.get<ContasRepository>(ContasRepository);
    contasService = await module.get<ContasService>(ContasService);
    clientProxyRMQ = await module.get<ClientProxyRMQ>(ClientProxyRMQ);
  });

  describe('Dado uma conta:', () => {
    it('deve salvar/criar uma conta', async () => {
    //  contsRepository.mockResolvedValue('Contas');
    //  expect(contsRepository.criar).not.toHaveBeenCalled();
    
      const clientProxySendSpy = jest.spyOn(contsRepository, 'criarConta').mockReturnValue(Conta);
      expect(clientProxySendSpy).not.toHaveBeenCalled();
      const criarContaDto: CriarContaDto = {
        idPessoa: 1,
        saldo: 15000.0,
        limiteSaqueDiario: 1000.0,
        flagAtivo: true,
        tipoConta: 43,
        idConta: 29,
      };
      const result = await contasService.criarConta(criarContaDto);
      expect(clientProxySendSpy).toHaveBeenCalledWith(criarContaDto);
      expect(result).toEqual(Conta);
    });

    it('deve atualizar o status da conta', async () => {
      const buscarPorIdSpy = jest.spyOn(contsRepository, 'buscarPorId').mockReturnValue(Conta);
      const atualizarStatusSpy = jest.spyOn(contsRepository, 'atualiarStatus').mockReturnValue(Conta);
      expect(atualizarStatusSpy).not.toHaveBeenCalled();
      const result = await contasService.bloquearConta(29);
      expect(buscarPorIdSpy).toHaveBeenCalledWith(29);
      expect(atualizarStatusSpy).toHaveBeenCalledWith(Conta, false);
      expect(result).toEqual(Conta);

    });

    it('deve retornar o saldo da conta', async () => {
      const buscarPorIdSpy = jest.spyOn(contsRepository, 'buscarPorId').mockReturnValue(Conta);
        expect(contsRepository.buscarPorId).not.toHaveBeenCalled();
      const result = await contasService.consultarSaldo(29);
      expect(buscarPorIdSpy).toHaveBeenCalledWith(29);
 
    });

     it('deve retornar lançar uma exceção', async () => {
      const buscarPorIdSpy = jest.spyOn(contsRepository,'buscarPorId').mockReturnValue(null);
      expect(contasService.consultarSaldo).rejects.toThrow(RpcException);
    });


  });
});
