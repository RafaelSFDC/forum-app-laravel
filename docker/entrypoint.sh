#!/bin/sh

set -e

echo "🚀 Iniciando aplicação Laravel..."

# Aguardar um momento para garantir que o sistema está pronto
sleep 2

# Verificar se o arquivo .env existe, se não, criar a partir do .env.example
if [ ! -f /var/www/html/.env ]; then
    echo "📝 Criando arquivo .env..."
    cp /var/www/html/.env.example /var/www/html/.env
fi

# Gerar chave da aplicação se não existir
if ! grep -q "APP_KEY=base64:" /var/www/html/.env; then
    echo "🔑 Gerando chave da aplicação..."
    php /var/www/html/artisan key:generate --force
fi

# Criar diretório do banco de dados se não existir
mkdir -p /var/www/html/database

# Criar arquivo SQLite se não existir
if [ ! -f /var/www/html/database/database.sqlite ]; then
    echo "🗄️ Criando banco de dados SQLite..."
    touch /var/www/html/database/database.sqlite
fi

# Executar migrações
echo "🔄 Executando migrações do banco de dados..."
php /var/www/html/artisan migrate --force

# Executar seeders apenas se a tabela users estiver vazia
USER_COUNT=$(php /var/www/html/artisan tinker --execute="echo \App\Models\User::count();" 2>/dev/null || echo "0")
if [ "$USER_COUNT" = "0" ]; then
    echo "🌱 Executando seeders..."
    php /var/www/html/artisan db:seed --force
fi

# Desabilitar SSR em produção para simplicidade
echo "🔧 Configurando Inertia..."
sed -i "s/'enabled' => true/'enabled' => false/" /var/www/html/config/inertia.php

# Limpar e otimizar cache
echo "🧹 Limpando cache..."
php /var/www/html/artisan config:cache
php /var/www/html/artisan route:cache
php /var/www/html/artisan view:cache

# Criar link simbólico para storage se não existir
if [ ! -L /var/www/html/public/storage ]; then
    echo "🔗 Criando link simbólico para storage..."
    php /var/www/html/artisan storage:link
fi

# Ajustar permissões
echo "🔒 Ajustando permissões..."
chown -R www:www /var/www/html/storage /var/www/html/bootstrap/cache /var/www/html/database
chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

echo "✅ Aplicação pronta! Iniciando serviços..."

# Iniciar supervisor
exec /usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf
