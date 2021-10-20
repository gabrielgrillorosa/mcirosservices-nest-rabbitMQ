
## Installation  and Running the app

A aplicação está dividida em 2 microserviços e um api gateway. 
O serviço de gerência de contas está na pasta microservice-gerencia-contas. Para subir o serviço basta entrar na pasta e excutar 
docker-compuse up --build.

O mermo deve ser feito para os demais serviços, sendo o serviço de gerência de transações está na pasta microservice-gerencia-transacoes e o api gateway na pasta api-gateway.

Tanto o Rabbitmq quanto o banco de ados são instalados juntos com o serviços. Também é dispobilisado um ambiente para gererência de banco de dados na porta 8000 com o usuário admin@admin.com e senha admin.

Os escripts de banco de dados foram feitos com o migrate do sequelize. Estão nas pastas seeders e migrations.
Para criar a base dados execute o comando sequelize db:create, para cirar as tableas digite sequlize db:migrate e para popular o banco 
de dados digite sequelize sequelize db:seed:all. Lembrando que para acessar a rede docker será necessário usar o node do serviço docker.
Sendo eles:

gerencia-contas	
	- banco de dados
		db-gc:5332 porta externa acessível via localhost 5434
	- aplicação
		gerencia-conta-app
		
gerencia-transacao	
	- banco de dados
		db-gt:5332 porta externa acessível via localhost 5432
	- aplicação 
		gerencia-transacao
		
api-gateway
	aplicacção
		gerencia-transacao:3002 porta externa e porta de acessa a api.
		
Documentação da api está disponível no endpoint gerencia-transacao:3002/api

Para quaiquer eclarecimentos meu email é gabrielgrace@gmail.com e meu telefone celular 27999603026.



