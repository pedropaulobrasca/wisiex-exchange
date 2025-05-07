#!/bin/sh

# Iniciar o worker em segundo plano
node dist/worker.js &
WORKER_PID=$!

# Iniciar o servidor principal
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