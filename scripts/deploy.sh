#!/bin/bash

# Script de deploy para o Render.com

set -e

echo "🚀 Preparando deploy para o Render.com..."

# Verificar se estamos no diretório correto
if [ ! -f "composer.json" ]; then
    echo "❌ Erro: Execute este script na raiz do projeto Laravel"
    exit 1
fi

# Verificar se o Docker está instalado
if ! command -v docker &> /dev/null; then
    echo "❌ Erro: Docker não está instalado"
    exit 1
fi

# Verificar se o Git está configurado
if [ -z "$(git config user.name)" ] || [ -z "$(git config user.email)" ]; then
    echo "❌ Erro: Configure o Git primeiro (git config user.name e user.email)"
    exit 1
fi

# Executar testes TypeScript
echo "🔍 Verificando tipos TypeScript..."
npm run types

# Executar linting
echo "🧹 Executando linting..."
npm run lint

# Executar formatação
echo "💅 Formatando código..."
npm run format

# Build local para testar
echo "🏗️ Testando build local..."
docker build -t forum-app:test .

# Testar se a imagem funciona
echo "🧪 Testando container..."
docker run --rm -d --name forum-app-test -p 8081:80 forum-app:test

# Aguardar o container inicializar
sleep 10

# Testar health check
if curl -f http://localhost:8081/health > /dev/null 2>&1; then
    echo "✅ Health check passou!"
else
    echo "❌ Health check falhou!"
    docker logs forum-app-test
    docker stop forum-app-test
    exit 1
fi

# Parar container de teste
docker stop forum-app-test

# Adicionar mudanças ao Git
echo "📝 Adicionando mudanças ao Git..."
git add .

# Verificar se há mudanças para commit
if git diff --staged --quiet; then
    echo "ℹ️ Nenhuma mudança para commit"
else
    # Commit das mudanças
    echo "💾 Fazendo commit das mudanças..."
    read -p "Digite a mensagem do commit: " commit_message
    git commit -m "$commit_message"
fi

# Push para o repositório
echo "🚀 Fazendo push para o repositório..."
git push

echo "✅ Deploy preparado! O Render.com irá automaticamente fazer o deploy da nova versão."
echo "🌐 Acesse: https://dashboard.render.com para acompanhar o progresso"
echo "📱 URL da aplicação: https://forum-laravel-app.onrender.com"
echo ""
echo "🌱 Seeds serão executados automaticamente no primeiro deploy"
echo "🔧 Para forçar re-execução dos seeds, defina FORCE_SEED=true no Render.com"
