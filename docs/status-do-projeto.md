# 📋 Status do Projeto Wisiex Exchange

## ✅ Requisitos atendidos até agora

### 1. Authentication
- [x] Login apenas com `username`.
- [x] Registrar usuário novo (se não existir).
- [x] Usuário inicia com **100 BTC** e **100,000 USD**.
- [x] Geração de **JWT** via **HTTP Bearer Authentication**.

### 2. Orders (Página Principal)

#### 2.1 Statistics
- [x] Cálculo de:
  - Último preço (Last Price)
  - Volume BTC (24h)
  - Volume USD (24h)
  - Maior preço (High 24h)
  - Menor preço (Low 24h)
- [ ] Saldo do usuário (em breve)

#### 2.2 Global Matches
- [x] Matches globais sendo gerados corretamente.
- [ ] Falta criar o endpoint `/matches` para listar.

#### 2.3 Buy and Sell
- [x] Criação de novas ordens BUY/SELL implementada.

#### 2.4 My Active Orders
- [ ] Falta criar endpoint para listar ordens ativas.
- [ ] Falta implementar Cancelamento de Ordens.

#### 2.5 My History
- [ ] Falta criar endpoint para listar histórico de matches do usuário.

#### 2.6 Bid e Ask (Order Book)
- [ ] Falta implementar serviço e endpoint do Livro de Ofertas (Order Book).

---

## ⚡ Resumo atual

| Item                          | Status   | Observações |
|:-------------------------------|:---------|:------------|
| Login                          | ✅       | OK |
| JWT                            | ✅       | OK |
| Estatísticas globais           | ✅       | OK |
| Histórico global de Matches    | ⚠️        | Falta endpoint |
| Formulário Buy/Sell (backend)  | ✅       | OK |
| Minhas Ordens Ativas           | ⚠️        | Falta listar e cancelar |
| Meu Histórico de Matches       | ❌       | Falta |
| Livro de Ofertas (Order Book)   | ❌       | Falta |

---

# 🧠 Observações Técnicas

- Projeto seguindo **DDD + Clean Architecture**.
- Testes unitários implementados para:
  - `OrderMatchingService`
  - `StatisticsService`
- Coverage de testes configurado via **Jest**.
- WebSocket configurado para atualizações em tempo real.
- Código modular, desacoplado, seguindo boas práticas.
