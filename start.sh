#!/bin/sh

if [ ! -d "node_modules" ]; then
  echo "node_modules não encontrado, instalando dependências..."
  npm install
fi

npm start