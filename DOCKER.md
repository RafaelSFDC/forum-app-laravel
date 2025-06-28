# 🐳 Configuração Docker para Render

Este documento explica como fazer deploy da aplicação no Render usando Docker.

## 📋 Pré-requisitos

- Conta no [Render](https://render.com/)
- Docker instalado localmente (para testes)
- Código da aplicação no GitHub/GitLab

## 🚀 Deploy no Render

### 1. Preparar o Repositório

Certifique-se de que todos os arquivos Docker estão commitados:

```bash
git add .
git commit -m "Adicionar configuração Docker para Render"
git push origin main
```

### 2. Criar Aplicação no Render

1. Acesse o [Render Dashboard](https://dashboard.render.com/)
2. Clique em "New +"
3. Selecione "Web Service"
4. Conecte seu repositório GitHub
5. Configure as seguintes opções:

#### Configurações Básicas:
- **Build method**: Docker
- **Dockerfile path**: `Dockerfile`
- **Port**: `80`

#### Variáveis de Ambiente:
```
APP_NAME=Forum App
APP_ENV=production
APP_DEBUG=false
APP_URL=https://forum-laravel-app.onrender.com
APP_KEY=base64:GENERATED_KEY_HERE
DB_CONNECTION=sqlite
DB_DATABASE=/var/www/html/database/database.sqlite
LOG_CHANNEL=stderr
CACHE_STORE=file
SESSION_DRIVER=file
QUEUE_CONNECTION=database
```

### 3. Configurar Domínio (Opcional)

- Na aba "Settings" da aplicação
- Adicione seu domínio customizado
- Configure o DNS conforme instruções do Render

## 🧪 Testar Localmente

### Usando Docker Compose:

```bash
# Build e iniciar
docker-compose up --build

# Acessar aplicação
open http://localhost:8080
```

### Usando Docker diretamente:

```bash
# Build da imagem
docker build -t forum-app .

# Executar container
docker run -p 8080:8080 \
  -e APP_ENV=production \
  -e APP_DEBUG=false \
  -e APP_URL=http://localhost:8080 \
  forum-app
```

## 📊 Monitoramento

### Health Check
A aplicação inclui um endpoint de health check em `/health`

### Logs
Para visualizar logs no Render:
1. Acesse sua aplicação no dashboard
2. Vá para a aba "Logs"
3. Monitore logs em tempo real

### Métricas
O Render fornece métricas automáticas:
- CPU usage
- Memory usage
- Request rate
- Response time

## 🔧 Configurações Avançadas

### Banco de Dados PostgreSQL

Para usar PostgreSQL em vez de SQLite:

1. Adicione um serviço PostgreSQL no Render
2. Configure as variáveis de ambiente:

```
DB_CONNECTION=pgsql
DB_HOST=your-postgres-host
DB_PORT=5432
DB_DATABASE=your-database
DB_USERNAME=your-username
DB_PASSWORD=your-password
```

### Upload de Arquivos (S3)

Para uploads em produção, configure AWS S3:

```
FILESYSTEM_DISK=s3
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_DEFAULT_REGION=us-east-1
AWS_BUCKET=your-bucket-name
```

### Cache Redis

Para melhor performance, use Redis:

```
CACHE_STORE=redis
REDIS_HOST=your-redis-host
REDIS_PORT=6379
REDIS_PASSWORD=your-redis-password
```

## 🐛 Troubleshooting

### Problemas Comuns:

1. **Erro de permissões**:
   - Verifique se as pastas storage/ e bootstrap/cache/ têm permissões corretas

2. **Erro de chave da aplicação**:
   - Gere uma nova chave: `php artisan key:generate`
   - Adicione nas variáveis de ambiente do Render

3. **Erro de banco de dados**:
   - Verifique se as migrações foram executadas
   - Confirme as configurações de conexão

4. **Assets não carregam**:
   - Verifique se o build do Vite foi executado corretamente
   - Confirme se APP_URL está correto

### Comandos Úteis:

```bash
# Acessar container em execução
docker exec -it container_name sh

# Ver logs do container
docker logs container_name

# Rebuild sem cache
docker build --no-cache -t forum-app .
```

## 📈 Otimizações

### Performance:
- A imagem usa Alpine Linux para menor tamanho
- Multi-stage build para otimizar layers
- Nginx + PHP-FPM para melhor performance
- Cache de configurações Laravel

### Segurança:
- Usuário não-root no container
- Headers de segurança no Nginx
- Arquivos sensíveis excluídos via .dockerignore

### Escalabilidade:
- Queue worker configurado via Supervisor
- Health checks para auto-healing
- Configuração pronta para load balancing

## 📞 Suporte

Se encontrar problemas:
1. Verifique os logs no Render Dashboard
2. Teste localmente com Docker
3. Consulte a [documentação do Render](https://render.com/docs)
