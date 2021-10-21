import { send } from 'process';
import { ExtratoPorPeriodoDto } from './../dto/extratoPorPeriodoDto.dtos';

import { RpcException } from '@nestjs/microservices';
import { DepositarDto } from './../dto/depositar.dto';
import { Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TransacaoRepositorio } from './../repository/trasacao.repository';
import { TransacaoService } from './transacao.service';
import { ConfigModule } from '@nestjs/config';
import { EMPTY, Observable } from 'rxjs';
import { ClientProxyRMQ } from '../../proxyrmq/client-proxyrmq';
import { ProxyRMQModule } from '../../proxyrmq/proxyrmq.module';
import { ClientProxyRMQFake } from './mockProxy';

describe('TransacaoService', () => {
  let transacaoService;
  let transacaoRepositorio;
  let clientProxyRMQ;

  const mockTransacaoRepositorio = () => ({
    criar: jest.fn(),
    buscar: jest.fn(),
    buscarPorData: jest.fn(),
    somatoriaValorSaqueDiario: jest.fn(),
    buscarPorId: jest.fn(),
    bucarPorPeriodo: jest.fn(),
  });

  const mockClientProxy = { send: jest.fn(), emit: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({

      imports: [ConfigModule.forRoot({ isGlobal: true }), ProxyRMQModule],
      providers: [
        TransacaoService,
        {
          provide: ClientProxyRMQ,
          useClass: ClientProxyRMQFake,
        },
        {
          provide: TransacaoRepositorio,
          useFactory: mockTransacaoRepositorio,
        },
      ],
    }).compile();

    transacaoRepositorio = await module.get<TransacaoRepositorio>(
      TransacaoRepositorio,
    );
    transacaoService = await module.get<TransacaoService>(TransacaoService);
    clientProxyRMQ = await module.get<ClientProxyRMQ>(ClientProxyRMQ);
  });

  describe('Dado que se deseja fazer um saque ou reposito:', () => {
    it('deve salvar/criar um deposito', async () => {
      transacaoRepositorio.criar.mockResolvedValue('transacao');
      expect(transacaoRepositorio.criar).not.toHaveBeenCalled();

      const valorSaqueDiaSpy = jest.spyOn(transacaoService, 'valorSaqueNoDia').mockReturnValue('some value');
      expect(valorSaqueDiaSpy).not.toHaveBeenCalled();
      const lastValueFrom = jest.fn();
      lastValueFrom.mockReturnValue(42);
      const clientProxySendSpy = jest.spyOn(clientProxyRMQ, 'send').mockReturnValue('some value');
      expect(clientProxySendSpy).not.toHaveBeenCalled();

      const depositarDto: DepositarDto = {
        idConta: 29,
        valor: 15000.0,
      };
      const result = await transacaoService.depositar(depositarDto);
      expect(transacaoRepositorio.criar).toHaveBeenCalledWith(depositarDto);
      expect(clientProxySendSpy).toHaveBeenCalledWith('depositar', depositarDto);
      expect(result).toEqual('some value'));
    });

    it('deve salvar/criar uma saque', async () => {
      const valorSaqueDiaSpy = jest.spyOn(transacaoService, 'valorSaqueNoDia').mockReturnValue('some value');
      expect(valorSaqueDiaSpy).not.toHaveBeenCalled();
      const clientProxySendSpy = jest.spyOn(clientProxyRMQ, 'send').mockReturnValue("Somevalue");
      expect(clientProxySendSpy).not.toHaveBeenCalled();
      const lastValueFrom = jest.fn();
      lastValueFrom.mockReturnValue(42);
      transacaoRepositorio.criar.mockResolvedValue();

      expect(transacaoRepositorio.criar).not.toHaveBeenCalled();

      const sacarDto: DepositarDto = {
        idConta: 29,
        valor: -15000.0,
      };
      
      const result = await transacaoService.depositar(sacarDto);
      expect(result).toEqual("Somevalue");
      
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
