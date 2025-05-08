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

## 🔄 Como rodar o projeto localmente (Desenvolvimento)

1. Clone o projeto
   ```bash
   git clone https://github.com/pedropaulobrasca/wisiex-exchange.git
   cd wisiex-exchange
   ```

2. Crie o arquivo `.env` na raiz do projeto
   ```
   # Configurações do servidor
   PORT=3000
   WORKER_PORT=3334
   
   # Banco de dados PostgreSQL
   DATABASE_URL=postgresql://wisiex_user:wisiex_pass@localhost:5432/wisiex_db
   
   # Redis
   REDIS_URL=redis://localhost:6379
   
   # Segurança
   JWT_SECRET=desenvolvimento_local_chave_secreta_12345
   ```

3. Inicie apenas os serviços de banco de dados com Docker Compose
   ```bash
   docker-compose up -d postgres redis
   ```

4. Instale as dependências
   ```bash
   npm ci
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

6. Inicie o servidor e o worker em terminais separados
   ```bash
   # Terminal 1: inicie o servidor principal
   npm run dev
   
   # Terminal 2: inicie o worker de processamento
   npm run worker
   ```

7. (Opcional) Gere dados fake para testes
   ```bash
   npm run faker
   ```

Acesse a API em `http://localhost:3000`  
Swagger: `http://localhost:3000/docs`  
REST Client (extensão do VSCode): use o arquivo `client.http`

---

## 🚢 Deploy com Coolify

Este projeto está configurado para deploy fácil na plataforma Coolify.

### Pré-requisitos
- Uma instância do Coolify configurada
- Acesso ao repositório Git do projeto

### Passos para deploy

1. **No painel do Coolify, crie um novo projeto**
   - Nome sugerido: "wisiex-exchange"

2. **Adicione os seguintes recursos ao projeto**:
   - Aplicação Node.js
   - PostgreSQL (versão 14)
   - Redis

3. **Configure a aplicação Node.js**:
   - Fonte: Selecione o repositório Git do projeto
   - Build settings:
     - Build command: `./build-coolify.sh` (script pré-configurado para build)
     - Start command: `./start.sh`
     - Portas: Mapeie 3000 e 3334 (servidor principal e worker)

4. **Configure as variáveis de ambiente no Coolify**:
   ```
   PORT=3000
   WORKER_PORT=3334
   DATABASE_URL=postgresql://[usuario_coolify]:[senha_coolify]@[host_postgres]:5432/wisiex_db
   REDIS_URL=redis://[host_redis]:6379
   JWT_SECRET=[chave_secreta_forte]
   POSTGRES_USER=[usuario_bd]
   POSTGRES_PASSWORD=[senha_bd]
   POSTGRES_DB=wisiex_db
   ```
   Substitua os valores entre colchetes pelos corretos do seu ambiente.

5. **Execute o deploy**
   - Após o primeiro deploy, as migrações do Prisma serão executadas automaticamente
   - O script start.sh inicia tanto o servidor principal quanto o worker

6. **Verificação após deploy**:
   - Acesse a URL fornecida pelo Coolify + `/health` para verificar se está funcionando
   - Verifique os logs para confirmar que tanto o servidor quanto o worker iniciaram

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

---

## 🛠 Solução de problemas

### Conexão com Redis
Se encontrar erros de conexão com Redis, verifique:
- Se o serviço Redis está rodando (`docker ps` para verificar)
- Se a variável `REDIS_URL` está configurada corretamente
- Formato correto: `redis://[host]:6379`

### Conexão com PostgreSQL
Se encontrar erros de conexão com o banco de dados:
- Verifique se o serviço PostgreSQL está rodando
- Confirme se a variável `DATABASE_URL` está correta
- Para executar migrações manualmente: `DATABASE_URL=... npx prisma migrate deploy`

### Deploy no Coolify
Se encontrar problemas no deploy com Coolify:
- Verifique os logs de build e execução
- Confirme se todas as variáveis de ambiente estão configuradas
- Se necessário, entre no container e execute `npx prisma migrate deploy` manualmente