# 🗣️ Fórum App

Uma aplicação de fórum moderna e responsiva construída com Laravel 12, React, TypeScript e Inertia.js. O projeto oferece uma experiência similar ao Reddit com funcionalidades completas de discussão, votação e comentários.

## ✨ Funcionalidades

### 🏠 Funcionalidades Principais
- **Sistema de Posts**: Criação de posts de texto, links e imagens
- **Sistema de Tópicos**: Organização de conteúdo por categorias
- **Sistema de Votação**: Upvote/downvote para posts e comentários
- **Sistema de Comentários**: Comentários aninhados com suporte a respostas
- **Busca Avançada**: Pesquisa por título e conteúdo dos posts
- **Filtros**: Ordenação por recente, popular e top posts
- **Autenticação**: Sistema completo de login/registro
- **Interface Responsiva**: Design otimizado para desktop e mobile

### 🎨 Interface e UX
- **Design Moderno**: Interface inspirada no Reddit com tema claro/escuro
- **Componentes Shadcn/ui**: Biblioteca de componentes consistente
- **Tailwind CSS**: Estilização utilitária e responsiva
- **Animações Suaves**: Transições e feedback visual
- **Acessibilidade**: Suporte a leitores de tela e navegação por teclado

### 🔧 Funcionalidades Técnicas
- **Server-Side Rendering (SSR)**: Performance otimizada com Inertia.js
- **TypeScript**: Tipagem estática para maior confiabilidade
- **Testes Automatizados**: Cobertura com Pest PHP
- **CI/CD**: Pipeline automatizado com GitHub Actions
- **Linting e Formatação**: ESLint, Prettier e Laravel Pint

## 🛠️ Stack Tecnológica

### Backend
- **Laravel 12**: Framework PHP moderno
- **PHP 8.2+**: Linguagem de programação
- **SQLite**: Banco de dados (configurável para MySQL/PostgreSQL)
- **Inertia.js**: Bridge entre Laravel e React

### Frontend
- **React 18**: Biblioteca JavaScript para UI
- **TypeScript**: Superset tipado do JavaScript
- **Vite**: Build tool e dev server
- **Tailwind CSS**: Framework CSS utilitário
- **Shadcn/ui**: Biblioteca de componentes
- **Lucide React**: Ícones SVG

### Ferramentas de Desenvolvimento
- **Pest**: Framework de testes para PHP
- **ESLint**: Linter para JavaScript/TypeScript
- **Prettier**: Formatador de código
- **Laravel Pint**: Formatador de código PHP
- **Concurrently**: Execução paralela de comandos

## 📋 Pré-requisitos

- **PHP 8.2** ou superior
- **Composer** 2.0+
- **Node.js 22** ou superior
- **NPM** ou **Yarn**
- **SQLite** (ou MySQL/PostgreSQL)

## 🚀 Instalação

### 1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/forum-app.git
cd forum-app
```

### 2. Instale as dependências do PHP
```bash
composer install
```

### 3. Instale as dependências do Node.js
```bash
npm install
```

### 4. Configure o ambiente
```bash
cp .env.example .env
php artisan key:generate
```

### 5. Configure o banco de dados
O projeto está configurado para usar SQLite por padrão. O arquivo será criado automaticamente:
```bash
touch database/database.sqlite
```

### 6. Execute as migrações e seeders
```bash
php artisan migrate --seed
```

### 7. Inicie o servidor de desenvolvimento
```bash
composer run dev
```

Este comando iniciará simultaneamente:
- Servidor Laravel (http://localhost:8000)
- Queue worker para jobs
- Vite dev server para assets

## 🎯 Uso

### Acessando a aplicação
- **Homepage**: http://localhost:8000
- **Login**: http://localhost:8000/login
- **Registro**: http://localhost:8000/register

### Usuário de teste
- **Email**: test@example.com
- **Senha**: password

### Criando conteúdo
1. Faça login na aplicação
2. Clique em "Criar Post" na página inicial
3. Escolha o tipo de post (texto, link ou imagem)
4. Selecione um tópico
5. Preencha o título e conteúdo
6. Publique o post

### Interagindo com posts
- **Votar**: Use os botões de upvote/downvote
- **Comentar**: Clique no post para ver detalhes e adicionar comentários
- **Filtrar**: Use os filtros de ordenação (recente, popular, top)
- **Buscar**: Use a barra de pesquisa para encontrar posts específicos

## 🧪 Testes

### Executar todos os testes
```bash
composer test
```

### Executar testes específicos
```bash
./vendor/bin/pest tests/Feature/ForumSearchTest.php
```

### Verificar tipagem TypeScript
```bash
npm run types
```

## 🔧 Comandos Úteis

### Desenvolvimento
```bash
# Servidor de desenvolvimento
composer run dev

# Servidor com SSR
composer run dev:ssr

# Build para produção
npm run build

# Verificar código
npm run lint
npm run format:check

# Corrigir formatação
npm run format
npm run lint --fix
```

### Laravel
```bash
# Limpar cache
php artisan cache:clear
php artisan config:clear
php artisan view:clear

# Recriar banco de dados
php artisan migrate:fresh --seed

# Executar queue
php artisan queue:work
```

## 📁 Estrutura do Projeto

```
forum-app/
├── app/
│   ├── Http/Controllers/     # Controllers da aplicação
│   ├── Models/              # Modelos Eloquent
│   └── Http/Middleware/     # Middlewares customizados
├── database/
│   ├── migrations/          # Migrações do banco
│   └── seeders/            # Seeders para dados iniciais
├── resources/
│   ├── js/                 # Código React/TypeScript
│   │   ├── components/     # Componentes React
│   │   ├── pages/         # Páginas Inertia
│   │   └── lib/           # Utilitários
│   └── css/               # Estilos CSS
├── routes/
│   ├── web.php            # Rotas web
│   └── auth.php           # Rotas de autenticação
└── tests/                 # Testes automatizados
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

### Padrões de código
- Use TypeScript para todo código frontend
- Siga as convenções do Laravel para PHP
- Execute os linters antes de fazer commit
- Escreva testes para novas funcionalidades

## 📝 Licença

Este projeto está licenciado sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🙏 Agradecimentos

- [Laravel](https://laravel.com) - Framework PHP
- [React](https://reactjs.org) - Biblioteca JavaScript
- [Inertia.js](https://inertiajs.com) - Bridge moderno
- [Tailwind CSS](https://tailwindcss.com) - Framework CSS
- [Shadcn/ui](https://ui.shadcn.com) - Componentes UI

---

Desenvolvido com ❤️ usando Laravel e React
