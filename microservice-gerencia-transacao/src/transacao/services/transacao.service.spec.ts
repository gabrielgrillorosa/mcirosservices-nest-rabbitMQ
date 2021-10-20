import { ExtratoPorPeriodoDto } from './../dto/extratoPorPeriodoDto.dtos';
import { ClientProxyRMQ } from './../../proxyrmq/client-proxyrmq';
import { emit, send } from 'process';
import { RpcException } from '@nestjs/microservices';
import { DepositarDto } from './../dto/depositar.dto';
import { SacarDto } from './../dto/sacarDto';

import { Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ProxyRMQModule } from '../../proxyrmq/proxyrmq.module';
import { Transacao } from '../entity/transacao.entity';
import { TransacaoRepositorio } from './../repository/trasacao.repository';
import { TransacaoService } from './transacao.service';
import { ConfigModule } from '@nestjs/config';
import { NOTFOUND } from 'dns';
import { async } from 'rxjs';


describe('TransacaoService', () => {
  let transacaoService;
  let transacaoRepositorio;
  let cientProxyRMQ;


  const mockTransacaoRepositorio = () => ({
    criar: jest.fn(),
    buscar: jest.fn(),
    buscarPorData: jest.fn(),
    somatoriaValorSaqueDiario: jest.fn(),
    buscarPorId: jest.fn(),
    bucarPorPeriodo: jest.fn(),
  });

  const mockClientProxy = () => ({
    send: jest.fn(),
    emit: jest.fn(),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ProxyRMQModule, ConfigModule.forRoot({ isGlobal: true })],
      providers: [
        TransacaoService,
        {
          provide: TransacaoRepositorio,
          useFactory: mockTransacaoRepositorio,
        },
        {
          provide: ClientProxyRMQ,
          useFactory: mockClientProxy,
        },
      ],
    }).compile();

    transacaoRepositorio = await module.get<TransacaoRepositorio>(
      TransacaoRepositorio,
    );
    transacaoService = await module.get<TransacaoService>(TransacaoService);
    cientProxyRMQ =  await module.get<ClientProxyRMQ>(ClientProxyRMQ);
  });

  describe('Dado que se deseja fazer um saque ou reposito:', () => {
    it('deve salvar/criar um saque na base de dados', async () => {
      transacaoRepositorio.criar.mockResolvedValue('transacao');
      expect(transacaoRepositorio.criar).not.toHaveBeenCalled();

      const depositarDto: DepositarDto = {
        idConta: 29,
        valor: 15000.0,
      };
      const result = await transacaoService.depositar(depositarDto);
      expect(transacaoRepositorio.criar).toHaveBeenCalledWith(depositarDto);
      expect(result).toEqual('transacao');
    });

    it('deve salvar/criar uma saque na base de dados', async () => {
      transacaoRepositorio.criar.mockResolvedValue('transacao');
      expect(transacaoRepositorio.criar).not.toHaveBeenCalled();
      const sacarDto: DepositarDto = {
        idConta: 29,
        valor: -15000.0,
      };
      const result = await transacaoService.depositar(sacarDto);
      expect(transacaoRepositorio.criar).toHaveBeenCalledWith(sacarDto);
      expect(result).toEqual('transacao');
    });

    it('Dado que seja solitado a realizar um saque/deposito sem conta ou inexistente', async () => {
      transacaoRepositorio.criar.mockResolvedValue();
      expect(transacaoRepositorio.criar).not.toHaveBeenCalled();
      expect(transacaoService.sacar(1)).rejects.toThrow(RpcException);
    });
  });

  describe('Dado que se deseja recuperar transacoes:', () => {
    it('deve retornar extrato de todas as transacoes', async () => {
      const MockSacarDto = {
        idConta: 29,
        valor: 500,
      };
      transacaoRepositorio.buscarPorId.mockResolvedValue(MockSacarDto);
      const result = await transacaoService.extrato(29);
      expect(result).toEqual(MockSacarDto);
      expect(transacaoRepositorio.buscarPorId).toHaveBeenCalled();
    });

    it('deve retornar extrato de todas as transacoes', async () => {
      const MockSacarDto = [
        { idConta: 29, valor: 500 },
        { idConta: 29, valor: 500 },
      ];

      transacaoRepositorio.bucarPorPeriodo.mockResolvedValue(MockSacarDto);
      const result = await transacaoService.extratoPorPeriodo(29);
      expect(transacaoRepositorio.bucarPorPeriodo).toHaveBeenCalled();
      expect(result).toEqual(MockSacarDto);
    
    });
  });
});
