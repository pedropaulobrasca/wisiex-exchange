# 📦 Wisiex Exchange - Backend Challenge

> Projeto desenvolvido como solução para o teste técnico da **Wisiex**.

---

## 🚀 Tecnologias Utilizadas

- **Node.js** + **TypeScript**
- **Express.js**
- **PostgreSQL** + **Prisma ORM**
- **Redis** (fila de matching)
- **WebSocket** (real-time stats)
- **Zod** (validações)
- **Swagger** (documentação da API)
- **Jest** (testes unitários)
- **Docker + Docker Compose**

---

## 📁 Estrutura de Pastas (Clean Architecture + DDD)

```
src/
  application/
    config/      # Configurações globais e Swagger
    database/    # Conexão com o banco de dados
    redis/       # Cliente Redis para filas
    use-cases/   # Casos de uso da aplicação
    websocket/   # Servidor WebSocket
  domain/
    entities/    # Entidades de domínio
    repositories/# Interfaces de repositórios
    services/    # Serviços de domínio
  infrastructure/
    prisma/      # Implementações dos repositórios com Prisma
  interfaces/
    controllers/ # Controladores da API
    middleware/  # Middlewares (autenticação, etc.)
    routes/      # Rotas da API
    websocket-handlers/ # Handlers de eventos WebSocket
  server.ts      # Ponto de entrada da aplicação
  worker.ts      # Worker para processamento de ordens
```

---

## ✅ Requisitos implementados

- [x] **Criar e autenticar usuário (JWT)**
- [x] **Criar ordem de compra ou venda**
- [x] **Cancelar ordem**
- [x] **Matching automático de ordens compatíveis**
- [x] **Armazenar histórico de matches**
- [x] **Atualizar estatísticas (último preço, high, low, volumes 24h)**
- [x] **Emitir dados via WebSocket**
- [x] **Health check: `/health`**
- [x] **Documentação com Swagger**
- [x] **Cobertura de testes com Jest**
- [x] **My matches (usuário autenticado): `/my-matches`**
- [x] **Listar todas as ordens abertas: `/orders`**
- [x] **Listar todos os matches globais: `/matches`**
- [x] **Order Book (livro de ofertas): `/order-book`**

---

## 🔄 Como rodar o projeto

1. Clone o projeto
   ```bash
   git clone https://github.com/pedropaulobrasca/wisiex-exchange.git
   cd wisiex-exchange
   ```

2. Crie o arquivo `.env` com base no `.env.example`
   ```
   PORT=3333
   DATABASE_URL=postgresql://wisiex_user:wisiex_pass@localhost:5432/wisiex_db
   REDIS_URL=redis://localhost:6379
   JWT_SECRET=secret
   BASE_URL=http://localhost:3333
   WORKER_PORT=3334
   ```

3. Inicie o PostgreSQL e Redis com Docker
   ```bash
   docker-compose up -d
   ```

4. Instale as dependências
   ```bash
   npm install
   ```

5. Configure o banco de dados com Prisma
   ```bash
   # Gera o cliente Prisma baseado no schema
   npx prisma generate
   
   # Executa as migrações para criar/atualizar o banco de dados
   npx prisma migrate deploy
   
   # Para visualizar o banco de dados (opcional)
   npx prisma studio
   ```

6. Inicie o servidor e o worker
   ```bash
   # Em um terminal, inicie o servidor principal
   npm run dev
   
   # Em outro terminal, inicie o worker de processamento
   npm run worker
   ```

7. (Opcional) Gere dados fake para testes
   ```bash
   npm run faker
   ```

Acesse a API em `http://localhost:3333`  
Swagger: `http://localhost:3333/docs`  
REST Client (extensão do VSCode): use o arquivo `client.http`

---

## 🧪 Rodar testes

```bash
# Rodar todos os testes
npm run test

# Com cobertura
npm run test:coverage

# Modo watch (para desenvolvimento)
npm run test:watch
```

---

## 📡 WebSocket

O servidor WebSocket roda na porta `3334` e emite os seguintes eventos:

- `newOrder` - Quando uma nova ordem é criada
- `newMatch` - Quando ocorre um match entre ordens
- `updateStatistics` - Atualizações de estatísticas de mercado
- `orderCancelled` - Quando uma ordem é cancelada
- `orderBookUpdate` - Atualizações no livro de ofertas
- `balanceUpdate` - Atualizações de saldo de usuários

Para conectar ao WebSocket:
```javascript
import { io } from 'socket.io-client';
const socket = io('http://localhost:3334');

socket.on('newMatch', (data) => {
  console.log('Novo match:', data);
});
```

---

## 🔍 Prisma

O projeto utiliza Prisma ORM para gerenciar as entidades:

- `User` - Usuários da plataforma com saldos BTC/USD
- `Order` - Ordens de compra e venda 
- `Match` - Registros de matches entre ordens

Para modificar o schema, edite `prisma/schema.prisma` e depois execute:
```bash
npx prisma migrate dev --name nome_da_alteracao
```