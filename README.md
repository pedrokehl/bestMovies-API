bestMovies
==========

AFIRMO QUE TODO E QUALQUER CÓDIGO DESTA APLICAÇÃO, EXCLUSO AS BIBLIOTECAS, FOI CRIADO POR MINHA PESSOA, PEDRO AFFONSO KEHL.

Projeto para prover uma API REST para uma aplicação de locação de filmes, com registro e login de clientes utilizando as seguintes tecnologias:
* NodeJS
* MySQL
* JWT
* Express
* Nodemailer

# Instruções de instalação

    # Baixe o projeto
    git clone --depth=1 https://github.com/pedrokehl/bestMovies-API.git
    
    # Mude o diretório
    cd bestMovies-API
    
    # Instale as bibliotecas
    npm install
    
    # Inicie a aplicação
    npm start

# Autenticação

A autenticação é feito por token, o front-end é responsável por armazenar o token, e enviá-lo a cada requisição, assim como atualizá-lo com a resposta do servidor. 
A API foi construída para ser stateless, não armazenando tokens.
O token expira em 10 minutos (pode ser facilmente configurado), e é gerado um novo token a cada requisição.
O logoff do usuário é realizado exclusivamente no front-end, eliminando o token da memória.
O token gerado para recuperação de conta, não pode ser utilizado para login/etc e expira em 24 horas.

## Registro do Usuário

#### REQUEST

POST: [http://localhost:3000/api/register](http://localhost:3000/api/register)

Body:

| Campo         | Descrição     | Obrigatorio |
| ------------- |-------------| :---------: |
| email | Email do usuário | X |
| password | Senha do usuário | X |
| name  | Nome do usuário | |

#### RESPONSE

Campo **authorization** no header com o token do usuário, deverá ser armazenado pelo front-end para fins de autenticação.

#### OBSERVAÇÕES

O usuário irá receber um e-mail de boas-vindas.

- - - -

## Login no sistema

#### REQUEST

POST: [http://localhost:3000/api/login](http://localhost:3000/api/login)

Body:

| Campo         | Descrição     | Obrigatorio |
| ------------- |-------------| :---------: |
| email | Email do usuário | X |
| password | Senha do usuário | X |

#### RESPONSE

Campo **authentication** no header com o token do usuário, deverá ser armazenado pelo front-end para fins de autenticação.

- - - -

## Esqueci a senha

#### REQUEST

POST: [http://localhost:3000/api/forgot](http://localhost:3000/api/forgot)

Body:

| Campo         | Descrição     | Obrigatorio |
| ------------- |-------------| :---------: |
| email | Email do usuário | X |

#### OBSERVAÇÕES

Irá enviar um e-mail para o usuário com a URL: [http://localhost:3000/reset/:email/:token](http://localhost:3000/reset/:email/:token), essa URL deverá ser tratada pelo front-end, abaixo possuirá mais informações sobre os end-points de recuperação da conta.
O token gerado expirará em 24 horas.

- - - -

## Verificar se a url de redefinição de senha está correta

#### REQUEST

GET: [http://localhost:3000/api/reset/:email/:token](http://localhost:3000/api/reset/:email/:token)

#### OBSERVAÇÕES

Não é necessário fazer essa requisição para verificar se a URL está correta, mas para um front-end ideal, fica mais claro, alertando o usuário que aquele token já está expirado antes mesmo de ele preencher os dados de redefinição.

- - - -

## Redefinir senha

#### REQUEST

POST: [http://localhost:3000/api/reset](http://localhost:3000/api/reset)

Body:

| Campo         | Descrição     | Obrigatorio |
| ------------- |-------------| :---------: |
| email | Email do usuário | X |
| password | Nova senha do usuário | X |
| token | Pode ser enviado pelo HEADER | X |

#### OBSERVAÇÕES

Depois de feita essa requisição, a senha do usuário será alterada.

- - - -

# Listagem de filmes disponíveis

GET: [http://localhost:3000/api/movies](http://localhost:3000/api/movies)

É necessário adicionar o token no header da requisição.
Retornará apenas os títulos que estão disponíveis para locação, em um array de filmes,
cada filme possuirá:

| Campo         | Descrição     |
| ------------- |-------------|
| id | Id do filme, será utilizado na hora do usuário locar o filme |
| title | Título do filme |
| director | Nome do diretor do filme |
| copies | Número TOTAL de cópias daquele filme |
| available | Número de cópias disponíveis para locação |

- - - -

# Busca de filmes

GET: [http://localhost:3000/api/movies/:title](http://localhost:3000/api/movies/:title)

É necessário adicionar o token no header da requisição.
A busca é limitada para buscas com mais de 3 carácteres para não sobrecarregar o banco de dados.

Retornará apenas os títulos que estão disponíveis para locação, e que possuem como subpalavra o parâmetro informado.
cada filme possuirá:

| Campo         | Descrição     |
| ------------- |-------------|
| id | Id do filme, será utilizado na hora do usuário locar o filme |
| title | Título do filme |
| director | Nome do diretor do filme |
| copies | Número TOTAL de cópias daquele filme |
| available | Número de cópias disponíveis para locação |

- - - -

# Locação de um filme

POST: [http://localhost:3000/api/rent](http://localhost:3000/api/rent)

É necessário adicionar o token no header (ou body) da requisição.

Body:

| Campo         | Descrição     | Obrigatorio |
| ------------- |-------------| :---------: |
| movie | ID do filme que o usuário deseja locar | X |


Será inserido em uma tabela o histórico da locação, com o id do filme, o id do usuário (buscado pelo payload do token), e irá atualizar o número de filmes disponíveis.
É recomendado o front-end atualizar o número de cópias disponíveis do filme, assim não será necessário fazer uma nova requisição da listagem.

- - - -

# Devolução de um filme

POST: [http://localhost:3000/api/return](http://localhost:3000/api/return)

É necessário adicionar o token no header (ou body) da requisição.

Body:

| Campo         | Descrição     | Obrigatorio |
| ------------- |-------------| :---------: |
| movie | ID do filme que o usuário deseja locar | X |


A tabela de histórico de locação será atualizada, e irá atualizar o número de filmes disponíveis.
É recomendado o front-end atualizar o número de cópias disponíveis do filme, assim não será necessário fazer uma nova requisição da listagem.

- - - -

# Status de requisições

200 - Sucesso

201 - Criado/Gerado

400 - Requisição incorreta

401 - Não autorizado (senha incorreta)

403 - Não possui acesso

404 - Página não encontrada

500 - Erro no servidor