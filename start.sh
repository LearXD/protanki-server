#!/bin/sh

if [ ! -d "node_modules" ]; then
  echo "node_modules não encontrado, instalando dependências..."
  npm install
fi

if [ ! -d "dist" ]; then
  echo "binário do servidor não encontrado, compilando..."
  npm run build
fi

npm start
