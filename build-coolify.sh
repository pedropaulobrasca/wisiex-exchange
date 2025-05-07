#!/bin/sh
set -e

echo "📦 Instalando dependências..."
npm ci

echo "🔧 Gerando cliente Prisma..."
npx prisma generate

echo "🔨 Compilando TypeScript..."
npx tsc

echo "✅ Verificando arquivos compilados..."
if [ ! -d "dist" ]; then
  echo "❌ Erro: Diretório dist/ não foi criado!"
  exit 1
fi

if [ ! -f "dist/server.js" ]; then
  echo "❌ Erro: Arquivo dist/server.js não foi gerado!"
  exit 1
fi

if [ ! -f "dist/worker.js" ]; then
  echo "❌ Erro: Arquivo dist/worker.js não foi gerado!"
  exit 1
fi

echo "📋 Listando arquivos na pasta dist/:"
ls -la dist/

echo "🎉 Build concluído com sucesso!" 