#!/bin/bash

# Script para build e teste local do Docker

set -e

echo "🐳 Construindo imagem Docker..."

# Build da imagem
docker build -t forum-app:latest .

echo "✅ Imagem construída com sucesso!"

echo "🚀 Para testar localmente, execute:"
echo "docker run -p 8080:8080 forum-app:latest"
echo ""
echo "Ou use docker-compose:"
echo "docker-compose up"
echo ""
echo "Acesse: http://localhost:8080"
