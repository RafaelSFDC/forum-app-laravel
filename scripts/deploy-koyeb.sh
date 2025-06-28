#!/bin/bash

# Script para deploy no Koyeb

set -e

echo "🚀 Preparando deploy para Koyeb..."

# Verificar se o git está limpo
if [[ -n $(git status --porcelain) ]]; then
    echo "❌ Há mudanças não commitadas. Commit suas mudanças primeiro."
    exit 1
fi

# Verificar se estamos na branch main
CURRENT_BRANCH=$(git branch --show-current)
if [[ "$CURRENT_BRANCH" != "main" ]]; then
    echo "⚠️  Você não está na branch main. Mudando para main..."
    git checkout main
fi

# Push para o repositório
echo "📤 Fazendo push para o repositório..."
git push origin main

echo "✅ Deploy iniciado!"
echo ""
echo "📋 Próximos passos:"
echo "1. Acesse https://app.koyeb.com/"
echo "2. Crie uma nova aplicação"
echo "3. Conecte seu repositório GitHub"
echo "4. Configure as variáveis de ambiente:"
echo "   - APP_NAME=Fórum"
echo "   - APP_ENV=production"
echo "   - APP_DEBUG=false"
echo "   - APP_URL=https://your-app.koyeb.app"
echo "   - APP_KEY=base64:GENERATED_KEY"
echo "   - DB_CONNECTION=sqlite"
echo "   - LOG_CHANNEL=stderr"
echo ""
echo "5. Configure a porta: 8080"
echo "6. Faça o deploy!"
echo ""
echo "📖 Consulte DOCKER.md para instruções detalhadas."
