import { BloquearContaDto } from './../dtos/bloquearConta.dto';
import { emit, send } from 'process';
import { RpcException } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import {
  ContaRepository,
} from '../repository/contas.repository';
import { ConfigModule } from '@nestjs/config';
import { CriarContaDto } from '../dtos/criarConta.dtos';

import { Conta } from '../entites/conta.entity';
import { ContasModule } from '../contas.module';
import { ContaService } from './contas.service';


describe('ContasService', () => {
  let contasService;
  let contsRepository;

  const mockContsRepository = () => ({
    criarConta: jest.fn(),
    buscarPorId: jest.fn(),
    atualizarStatus: jest.fn(),
    listarContas: jest.fn(),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ContasModule,
        ConfigModule.forRoot({ isGlobal: true }),
      ],
      providers: [
        ContaService,
        {
          provide: ContaRepository,
          useFactory: mockContsRepository,
        },
      ],
    }).compile();

    contsRepository = await module.get<ContaRepository>(ContaRepository);
    contasService = await module.get<ContaService>(ContaService);
  });

  describe('Dado que se deseja fazer um saque ou reposito:', () => {
    it('deve salvar/criar um saque na base de dados', async () => {
      contsRepository.mockResolvedValue('Contas');
      expect(contsRepository.criar).not.toHaveBeenCalled();
      const criarContaDto: CriarContaDto = {
        idPessoa: 1,
        saldo: 15000.0,
        limiteSaqueDiario: 1000.0,
        flagAtivo: true,
        tipoConta: 43,
        idConta: 29,
      };
      const result = await contasService.criarConta(criarContaDto);
      expect(contsRepository.criar).toHaveBeenCalledWith(criarContaDto);
      expect(result).toEqual(Conta);
    });

    it('deve salvar/criar uma saque na base de dados', async () => {
      contsRepository.atualizarStatus.mockResolvedValue('conta');
      expect(contsRepository.atualizarStatus).not.toHaveBeenCalled();
      const result = await contasService.bloquearConta(29);
      expect(contsRepository.atualizarStatus).toHaveBeenCalledWith(29);
      expect(result).toEqual('conta');
    });

    it('deve salvar/criar uma saque na base de dados', async () => {
      contsRepository.buscarPorId.mockResolvedValue('saldo');
      expect(contsRepository.buscarPorId).not.toHaveBeenCalled();
      const result = await contasService.consultarSaldo(29);
      expect(contsRepository.buscarPorId).toHaveBeenCalledWith(29);
      expect(result).toEqual('saldo');
    });
  });
});
