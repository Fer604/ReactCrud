# Biblioteca - React CRUD

App simples de biblioteca: cadastro/login de usuários (JWT), catálogo de livros
com busca avançada e painel de administração. Banco **SQLite** local (sem MySQL).

---

## Tecnologias

- React + Vite + Tailwind (front)
- Node.js + Express (back)
- SQLite via módulo nativo `node:sqlite` (sem instalar nada)
- JWT (`jsonwebtoken`) para autenticação

---

## Estrutura

```
src/
├── back/
│    └── server.js      # API (auth, livros, busca, admin)
├── db/
│    └── config.js      # cria o SQLite + popula dados iniciais
└── front/
     ├── auth.js        # helpers de login (localStorage)
     └── pages/         # Login, Register, Home, Create, Update, Admin
```

> O arquivo `src/db/biblioteca.db` é criado e populado automaticamente na
> primeira vez que o servidor sobe.

---

## Como rodar

Pré-requisito: Node.js >= 22 (usa o `node:sqlite` embutido).

```bash
npm install
```

Em um terminal, suba a API:

```bash
npm run server
```

Em outro terminal, suba o front:

```bash
npm run dev
```

---

## Login de teste

- **Admin:** `admin@biblioteca.com` / `admin123`
- **Usuário:** `maria@email.com` / `123456`

Ou crie uma conta nova na tela de cadastro.

---

## Funcionalidades

- Cadastro de usuário
- Login com validação por JWT
- Catálogo de livros (listar, criar, editar, deletar)
- Busca avançada por título, autor ou ISBN
- Painel admin: estatísticas, livros emprestados, acervo e usuários cadastrados
