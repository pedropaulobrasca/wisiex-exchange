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
  app/
    config/
    database/
    redis/
    websocket/
  domain/
    entities/
    repositories/
    services/
  application/
    use-cases/
  infrastructure/
    prisma/
  interfaces/
    controllers/
    routes/
    websocket-handlers/
  server.ts
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
2. Crie o `.env` com base no `.env.example`
3. Rode:

```bash
docker-compose up -d
npm i
npm run dev
npm run worker
```

Acesse em `http://localhost:3333`  
Swagger: `http://localhost:3333/api/docs`
REST Client (extensão do VSCode): `client.http`

---

## 🧪 Rodar testes

```bash
npm run test
npm run test:coverage
```

---

## 📡 WebSocket

Estatísticas em tempo real são emitidas no canal:

```
/ws
event: statistics:update
```