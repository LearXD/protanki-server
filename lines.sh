#!/bin/bash

# Defina o diretório alvo
diretorio="./src"

# Contador de linhas
total_linhas=0

# Função para contar linhas
contar_linhas() {
    for arquivo in "$1"/*; do
        if [ -f "$arquivo" ]; then
            linhas=$(awk 'END {print NR}' "$arquivo")
            echo "$arquivo: $linhas linhas"
            total_linhas=$((total_linhas + linhas))
        elif [ -d "$arquivo" ]; then
            contar_linhas "$arquivo"
        fi
    done
}

# Inicie a contagem a partir do diretório alvo
contar_linhas "$diretorio"

echo "Total de linhas em todos os arquivos: $total_linhas"