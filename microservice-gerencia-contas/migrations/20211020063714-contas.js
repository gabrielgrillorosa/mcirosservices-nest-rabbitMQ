('use strict');
module.exports = {
  up: async (queryInterface, Sequelize) => {
  
  
   await queryInterface.createTable('pessoas', {
      idPessoa: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT,
      },
      nome: {
        type: Sequelize.STRING(50),
      },
      cpf: {
        type: Sequelize.STRING(11),
      },
      dataNacismento: {
        type: Sequelize.DATE,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      }
    });   
    
    await queryInterface.createTable('contas', {
    
      idConta: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT,
      },
      idPessoa: {
        type: Sequelize.BIGINT,
        references: { model: 'pessoas', key: 'idPessoa' },
      },
      flagAtivo: {
        type: Sequelize.BOOLEAN,
      },
      saldo: {
        type: Sequelize.DECIMAL(25, 2),
      },
      limiteSaqueDiario: {
        type: Sequelize.DECIMAL(25, 2),
      },
      tipoConta: {
        type: Sequelize.NUMERIC,
      },
      dataCriacao: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
       
    });   
   
  },
  
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('contas');
    await queryInterface.dropTable('pessoas');
    
  },
};
