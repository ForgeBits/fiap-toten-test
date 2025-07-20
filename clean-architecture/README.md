# Sistema de Controle de Pedidos Fast Totem

## Sobre o Projeto

O **Sistema de Controle de Pedidos** é uma solução completa de autoatendimento para restaurantes que visa eliminar falhas de comunicação e otimizar o processo de pedidos. O sistema permite que clientes façam pedidos personalizados diretamente pela plataforma, desde a consulta ao cardápio até o pagamento, garantindo que a cozinha receba informações precisas sobre o que preparar.

## Objetivos Principais

- **Eliminar falhas de comunicação**: Evitar que pedidos sejam perdidos, mal interpretados ou esquecidos
- **Controle de estoque integrado**: Informar à cozinha quais itens estão disponíveis, impedindo pedidos que não podem ser concluídos
- **Acompanhamento em tempo real**: Manter clientes informados sobre o status de seus pedidos
- **Redução de perdas**: Minimizar a insatisfação dos clientes e perda de negócios por problemas operacionais

## Funcionalidades

### 🛒 Autoatendimento

- Interface intuitiva para montagem de pedidos
- Opção de identificação do cliente (**CPF**, **nome** e **e-mail**) para análise de dados
- Exibição completa do cardápio com **nome**, **descrição** e **preço** de cada item
- Personalização de pedidos conforme disponibilidade do estoque

### 💳 Sistema de Pagamento

- Integração com **Mercado Pago** via QR Code
- Processamento automático de pagamentos
- Encaminhamento direto para preparação após confirmação do pagamento

### 📊 Acompanhamento de Pedidos

Status em tempo real para o cliente:

- **Recebido**: Pedido confirmado pelo sistema
- **Em Preparação**: Cozinha iniciou o preparo
- **Pronto**: Pedido finalizado e disponível para retirada
- **Finalizado**: Pedido entregue ao cliente

### 🔧 Painel Administrativo

Funcionalidades para funcionários autorizados:

- **Gestão de produtos**: Criar, editar, remover e buscar itens do cardápio
- **Controle de categorias**: Organização do cardápio por categorias
- **Gestão de estoque**: Controle de disponibilidade de ingredientes
- **Relatórios**: Análise de dados de vendas e preferências dos clientes

## ⚙️ Configuração do Ambiente

Antes de executar o projeto, é necessário configurar as variáveis de ambiente:

Crie o arquivo .env na raiz do projeto
Copie o conteúdo do arquivo .env.example como base
Configure as variáveis de acordo com seu ambiente local

```bash
cp .env.example .env
```

⚠️ Importante: Certifique-se de configurar todas as variáveis necessárias no arquivo .env antes de iniciar a aplicação.

## 🐳 Rodar o projeto com Docker Compose

Para facilitar o gerenciamento do seu projeto com Docker Compose, utilize os comandos abaixo:

```bash
# Subir todos os serviços em modo destacado (background)
docker-compose up -d

# Parar todos os serviços
docker-compose down
```

## 🛠️ Configuração do projeto

```bash
$ npm install
```

## ▶️ Compile e execute o projeto

```bash
# Build do projeto
npm run build

# Iniciar a aplicação
npm run start
```
## 🚀 Fluxos de Utilização da API

A API possui dois fluxos principais de utilização. Siga os passos abaixo na ordem indicada:

### 🔐 Fluxo Administrativo (Colaboradores)
Para funcionários que gerenciam o sistema:

#### 1. Criar Colaborador

Endpoint: POST /collaborators
- Campos obrigatórios:
  - document,
  - name,
  - email,
  - type (admin/operator/manager/supervisor),
  - status (active/inactive),
  - password 

#### 2. Fazer Login

Endpoint: POST /authentication/login
- Credenciais: 
  - document,
  - email,
  - password
- Resultado: 
  - Token JWT para autenticação

#### 3. Configurar Sistema (ordem flexível)

- Categorias: POST /categories - Criar categorias do cardápio
- Itens de Produto: POST /product-items/register - Cadastrar ingredientes/componentes
- Produtos: POST /products - Criar produtos vinculando categorias e itens

#### 4. Gerenciar Pedidos

- Listar prontos para preparo: GET /orders/ready-prepare
- Iniciar preparo: PATCH /orders/{id}/initiate-preparation
- Finalizar preparo: PATCH /orders/{id}/finish-preparation
- Finalizar pedido: PATCH /orders/{id}/finish-order


### 🛍️ Fluxo do Cliente (Pedidos)
Para clientes realizando pedidos:
#### 1. Identificação do Cliente (opcional)

- Opção A: POST /clients/create - Criar conta com dados pessoais
- Opção B: POST /clients/identity-client - Identificar-se por CPF 

#### 2. Criar Pedido

- Endpoint: POST /orders
  - Requisitos: Informar clientId e selecionar produtos existentes
  - Resultado: Pedido criado com status "Recebido"

#### 3. Realizar Pagamento

Endpoint: POST /payment/create
- Campos: 
  - amount, 
  - description, 
  - orderId, 
  - callbackUrl, 
  - expirationMinutes

- Resultado: 
  - URL com QR Code do Mercado Pago

#### 4. Acompanhar Pedido

- Buscar por ID: GET /orders/{id}
- Consultar status do pagamento: GET /payment/status/{transactionId}


## 📋 Documentação da API (Swagger)
A documentação completa da API está disponível via Swagger UI com interface interativa para teste dos endpoints.
Como acessar o Swagger:

Certifique-se de que o ambiente está configurado:

Arquivo .env criado e configurado
Docker e Docker Compose instalados


Inicie os serviços:
```bash
docker-compose up -d
```

Aguarde a inicialização completa:

O sistema executará automaticamente as migrações do Prisma
Os dados iniciais (seeds) serão inseridos no banco
O servidor estará disponível na porta 1337


Acesse a documentação:

[➡️ http://localhost:1337/api-docs](http://localhost:1337/api-docs)


Recursos disponíveis no Swagger:

* Teste de endpoints em tempo real
* Autenticação JWT integrada (clique em "Authorize" para inserir o token)
* Exemplos de requisições e respostas
* Esquemas de dados detalhados
* Códigos de status HTTP

Credenciais de teste:
Para testar endpoints que requerem autenticação, utilize:

* document: 22272874207
* Senha: pass@123


💡 Dica: Primeiro faça login no endpoint de autenticação, copie o token JWT retornado e use o botão "Authorize" no topo da página do Swagger para configurar a autenticação.


## 📚 Documentação

[➡️ Documentação DDD Event Storming e Linguagem Ubíqua](https://miro.com/app/board/uXjVIBqsMYk=/)

[➡️ Modelagem inicial de dados](https://drive.google.com/file/d/1opO3G5XP77L2mON5wIIkw7PjGqPS4PUU/view?usp=sharing)

[➡️ Collection do postman](https://www.postman.com/vineco77/workspace/11soat-fiap-fast-totem-api/collection/37380994-3bf8f85d-8702-436d-8a0d-af671f0b5abf?action=share&creator=37380994)

## 🧱 Tecnologias Utilizadas

[![Nest Js](	https://img.shields.io/badge/nestjs-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)](#)
[![Typescript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](#)
[![Node Js](	https://img.shields.io/badge/Node%20js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](#)
[![Prisma ORM](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)](#)
[![Prisma ORM](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](#)
[![Docker](https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white)](#)
[![Docker Compose](https://img.shields.io/badge/Docker%20Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white)](#)
[![Swagger](https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=Swagger&logoColor=white)](#)
[![Mercado Pago](https://img.shields.io/badge/Mercado_Pago-API-007ACC?style=for-the-badge&logoColor=white)](#)
[![VScode](	https://img.shields.io/badge/Made%20for-VSCode-1f425f.svg)](#)