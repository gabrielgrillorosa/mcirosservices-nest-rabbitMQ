import { ExtratoDto } from './../dto/extrato.dto';
import { SacarDto } from './../dto/sacarDto';
import { ExtratoPorPeriodoDto } from './../dto/extratoPorPeriodoDto.dtos';
import { RpcException } from '@nestjs/microservices';
import { DepositarDto } from './../dto/depositar.dto';
import { Test, TestingModule } from '@nestjs/testing';
import { TransacaoRepositorio } from './../repository/trasacao.repository';
import { TransacaoService } from './transacao.service';
import { ConfigModule } from '@nestjs/config';
import { ClientProxyRMQ } from '../../proxyrmq/client-proxyrmq';
import { ProxyRMQModule } from '../../proxyrmq/proxyrmq.module';
import { Transacao } from '../entity/transacao.entity';

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

 
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot({ isGlobal: true }), ProxyRMQModule],
      providers: [
        TransacaoService,
        ClientProxyRMQ,
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
      const depositarDto: DepositarDto = {
        idConta: 29,
        valor: 500,
      };

      transacaoRepositorio.criar.mockResolvedValue(Transacao);
      expect(transacaoRepositorio.criar).not.toHaveBeenCalled();

      const clientProxyEmitSpy = jest.spyOn(clientProxyRMQ, 'emit').mockResolvedValue('somevalue');
      expect(clientProxyEmitSpy).not.toHaveBeenCalled();

      const result = await transacaoService.depositar(depositarDto);
      expect(await transacaoRepositorio.criar).toHaveBeenCalledWith(depositarDto);
      expect(result).toBe(Transacao);
    });

    it('deve salvar/criar uma saque', async () => {
      transacaoRepositorio.criar.mockResolvedValue(Transacao);
      expect(transacaoRepositorio.criar).not.toHaveBeenCalled();

      const valorSaqueDiaSpy = jest.spyOn(transacaoService, 'valorSaqueNoDia').mockResolvedValue("some value");
      expect(valorSaqueDiaSpy).not.toHaveBeenCalled();

      const clientProxySendSpy = jest.spyOn(clientProxyRMQ, 'send').mockResolvedValue('somevalue');
      expect(clientProxySendSpy).not.toHaveBeenCalled();


      const sacarDto: SacarDto = {
        idConta: 29,
        valor: -15000.0,
        valorSacadoDia: 1500,
      };
      const result = await transacaoService.depositar(sacarDto);
      expect(transacaoRepositorio.criar).toHaveBeenCalledWith(sacarDto);
      expect(result).toEqual(Transacao);
    });

    it('Dado que seja solitado a realizar um saque/deposito sem conta ou inexistente', async () => {
      transacaoRepositorio.criar.mockResolvedValue();
      expect(transacaoRepositorio.criar).not.toHaveBeenCalled();
      expect(transacaoService.sacar(1)).rejects.toThrow(RpcException);
    });
  });

  describe('Dado que se deseja recuperar transacoes:', () => {
    it('deve retornar extrato de todas as transacoes', async () => {
      const mockExtratoDto: ExtratoDto = new ExtratoDto();
      mockExtratoDto.idConta = 29;
      transacaoRepositorio.buscarPorId.mockResolvedValue(mockExtratoDto);
      const result = await transacaoService.extrato(mockExtratoDto);
      expect(transacaoRepositorio.buscarPorId).toHaveBeenCalledWith(mockExtratoDto.idConta);
      expect(result).toEqual(mockExtratoDto);
     
    });

    it('deve retornar extrato das transacoes por periodo', async () => {
      const mockExtratoPorPeriodoDto: ExtratoPorPeriodoDto = new ExtratoPorPeriodoDto();
      mockExtratoPorPeriodoDto.idConta=29;
      mockExtratoPorPeriodoDto.dataInicial = new Date();
      mockExtratoPorPeriodoDto.dataFinal = new Date()
      let transacoes: Transacao[];

      transacaoRepositorio.bucarPorPeriodo.mockResolvedValue(transacoes);
      const result = await transacaoService.extratoPorPeriodo(mockExtratoPorPeriodoDto);
      expect(transacaoRepositorio.bucarPorPeriodo).toHaveBeenCalledWith(
        mockExtratoPorPeriodoDto.idConta,
        mockExtratoPorPeriodoDto.dataInicial,
        mockExtratoPorPeriodoDto.dataFinal,
      );
      expect(result).toEqual(transacoes);
    });
  });
});
