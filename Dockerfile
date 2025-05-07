FROM node:18-alpine

WORKDIR /app

# Copiar arquivos de configuração
COPY package*.json ./
COPY tsconfig.json ./
COPY nodemon.json ./
COPY prisma ./prisma/

# Instalar dependências
RUN npm ci

# Gerar cliente Prisma
RUN npx prisma generate

# Copiar código fonte
COPY src ./src

# Compilar TypeScript
RUN npm run build

# Script para iniciar tanto o servidor quanto o worker
COPY start.sh ./
RUN chmod +x start.sh

# Porta do servidor principal
EXPOSE 3000
# Porta do worker (WebSocket)
EXPOSE 3334

CMD ["./start.sh"] 