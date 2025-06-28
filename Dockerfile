# Multi-stage build para aplicação Laravel com React
FROM node:22-alpine AS node-builder

WORKDIR /app

# Copiar arquivos de dependências do Node.js
COPY package*.json ./
COPY tsconfig.json ./
COPY vite.config.ts ./
COPY components.json ./

# Instalar dependências do Node.js
RUN npm ci

# Copiar código fonte do frontend
COPY resources/ ./resources/
COPY public/ ./public/

# Build dos assets
RUN npm run build

# Stage principal - PHP
FROM php:8.2-fpm-alpine

# Instalar dependências do sistema
RUN apk add --no-cache \
    nginx \
    supervisor \
    sqlite \
    zip \
    unzip \
    git \
    curl \
    oniguruma-dev \
    libxml2-dev \
    freetype-dev \
    libjpeg-turbo-dev \
    libpng-dev \
    libzip-dev

# Instalar extensões PHP
RUN docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install \
    pdo \
    pdo_sqlite \
    mbstring \
    xml \
    ctype \
    json \
    tokenizer \
    zip \
    gd \
    bcmath

# Instalar Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Criar usuário para a aplicação
RUN addgroup -g 1000 -S www && \
    adduser -u 1000 -S www -G www

# Definir diretório de trabalho
WORKDIR /var/www/html

# Copiar arquivos de dependências do PHP
COPY composer.json composer.lock ./

# Instalar dependências do PHP
RUN composer install --no-dev --optimize-autoloader --no-interaction --no-progress

# Copiar código fonte da aplicação
COPY . .

# Copiar assets buildados do stage anterior
COPY --from=node-builder /app/public/build ./public/build

# Configurar permissões
RUN chown -R www:www /var/www/html \
    && chmod -R 755 /var/www/html/storage \
    && chmod -R 755 /var/www/html/bootstrap/cache

# Copiar configurações do Nginx
COPY docker/nginx.conf /etc/nginx/nginx.conf
COPY docker/default.conf /etc/nginx/http.d/default.conf

# Copiar configuração do Supervisor
COPY docker/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Copiar script de entrada
COPY docker/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

# Criar diretórios necessários
RUN mkdir -p /var/log/supervisor \
    && mkdir -p /run/nginx \
    && mkdir -p /var/www/html/storage/logs \
    && mkdir -p /var/www/html/storage/framework/cache \
    && mkdir -p /var/www/html/storage/framework/sessions \
    && mkdir -p /var/www/html/storage/framework/views

# Expor porta
EXPOSE 8080

# Definir usuário
USER www

# Comando de entrada
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
