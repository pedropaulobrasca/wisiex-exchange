#!/bin/sh

# Verificar variáveis de ambiente obrigatórias
echo "Verificando variáveis de ambiente..."

# Lista de variáveis obrigatórias
REQUIRED_VARS="PORT WORKER_PORT DATABASE_URL REDIS_URL JWT_SECRET"

# Verificar cada variável
for VAR in $REQUIRED_VARS; do
  if [ -z "$(eval echo \$$VAR)" ]; then
    echo "⚠️ ERRO: Variável de ambiente $VAR não está definida!"
    echo "Por favor, configure esta variável no Coolify ou arquivo .env"
    exit 1
  else
    echo "✅ $VAR: OK"
  fi
done

echo "🔄 Iniciando aplicação com as seguintes configurações:"
echo "- PORT: $PORT"
echo "- WORKER_PORT: $WORKER_PORT"
echo "- DATABASE_URL: $(echo $DATABASE_URL | sed 's/:.*.@/:***@/')"
echo "- REDIS_URL: $REDIS_URL"
echo "- JWT_SECRET: $(echo $JWT_SECRET | cut -c1-5)***"

# Iniciar o worker em segundo plano
echo "🚀 Iniciando worker..."
node dist/worker.js &
WORKER_PID=$!

# Iniciar o servidor principal
echo "🚀 Iniciando servidor principal..."
node dist/server.js &
SERVER_PID=$!

# Função para lidar com o encerramento
handle_term() {
  echo "Encerrando processos..."
  kill $WORKER_PID
  kill $SERVER_PID
  exit 0
}

# Registrar tratamento de sinal
trap handle_term SIGTERM SIGINT

# Manter o script em execução
wait 