# Event Management System

Sistema completo de gerenciamento de eventos com frontend React e backend Node.js.

## Como Executar

### Execução com Docker (Recomendado)

1. Clone o repositório e navegue até a pasta:

```bash
git clone <repo-url>
cd "Event Managements"
```

2. Execute com Docker Compose:

```bash
docker-compose up -d
```

3. Acesse a aplicação:

- Frontend: http://localhost:3000
- Backend: http://localhost:3001
- Banco de dados: localhost:5434

4. Login admin:

- Email: admin@admin.com
- Senha: admin123

### Execução Local

#### Backend

```bash
cd backend
npm install
# Configure as variáveis de ambiente (.env)
npm run dev
```

#### Frontend

```bash
cd frontend
npm install
npm run dev
```

#### Banco de dados

Configure PostgreSQL local na porta 5432.

## Estrutura do Projeto

### Backend (Node.js/Express)

```
backend/src/
├── controllers/     # Lógica de negócio
├── entities/        # Modelos do banco (TypeORM)
├── routes/          # Rotas da API
├── middleware/      # Autenticação e autorização
├── config/          # Configuração do banco
└── server.js        # Servidor principal
```

### Frontend (React/Vite)

```
frontend/src/
├── components/
│   ├── Auth/        # Login e cadastro
│   ├── Dashboard/   # Painel principal
│   ├── Events/      # Gerenciamento de eventos
│   ├── Registration/# Gerenciamento de inscrições
│   └── Layout/      # Navegação
├── contexts/        # Context API (autenticação)
├── services/        # Chamadas para API
└── App.jsx          # Roteamento principal
```

## Funcionalidades Implementadas

### Usuários Comuns

- Autenticação (login/logout)
- Visualizar eventos disponíveis
- Inscrever-se em eventos
- Cancelar inscrições
- Dashboard com estatísticas pessoais

### Administradores

- Criar, editar e excluir eventos
- Visualizar lista de participantes
- Exportar participantes em CSV

## Tecnologias Utilizadas

### Backend

- Node.js + Express.js
- TypeORM + PostgreSQL
- Express Session (autenticação)
- bcryptjs (hash de senhas)
- Joi (validação de dados)

### Frontend

- React 18 + Vite
- Material-UI (componentes)
- React Router (roteamento)
- Axios (requisições HTTP)

### Infraestrutura

- Docker + Docker Compose
- PostgreSQL

## API Endpoints

### Autenticação

- `POST /api/auth/register` - Cadastrar usuário
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Verificar sessão

### Eventos

- `GET /api/events` - Listar eventos
- `POST /api/events` - Criar evento (admin)
- `PUT /api/events/:id` - Editar evento (admin)
- `DELETE /api/events/:id` - Excluir evento (admin)
- `GET /api/events/:id/registrations` - Ver participantes (admin)

### Inscrições

- `POST /api/registrations` - Inscrever-se em evento
- `DELETE /api/registrations/:eventId` - Cancelar inscrição
- `GET /api/registrations/my-events` - Minhas inscrições

## Arquitetura e Padrões

- Padrão MVC no backend
- Componentes funcionais no React
- Context API para gerenciamento de estado
- Middleware de autenticação e autorização
- Validação de dados no frontend e backend
- Tratamento de erros centralizado
- Sessões seguras com cookies HttpOnly
