# 📚 Book Shop API

API REST simples para gerenciamento de livros utilizando **Node.js + Express + MySQL (MariaDB)**.

---

## 🚀 Tecnologias utilizadas

- Node.js
- Express
- MySQL2 (com Promises)
- dotenv
- CORS

---

## 📁 Estrutura do projeto

```

src/
├── back/
│    └── server.js       # API (rotas)
├── db/
│    ├── config.js       # conexão + init do banco
│    └── init.sql        # schema + dados iniciais
.env

````

---

## ⚙️ Pré-requisitos

Antes de rodar, você precisa ter instalado:

- Node.js (>= 18 recomendado)
- MySQL ou MariaDB rodando localmente

---

## 🔑 Configuração

Crie um arquivo `.env` na raiz do projeto:

```env
DB_HOST=localhost
DB_USER=root
DB_PASS=
DB_NAME=book_shop
DB_PORT=3306
````

---

## 📦 Instalação

No terminal, dentro do projeto:

```bash
npm install
```

---

## ▶️ Como rodar o projeto

```bash
node src/back/server.js
```

Se tudo estiver certo, você verá:

```
Database garantido
Dump aplicado (primeira vez)
Server running on port 3001
```

---

## 🧠 Importante (sobre o banco)

Na primeira execução:

* O banco `book_shop` será criado automaticamente
* O arquivo `init.sql` será executado
* A tabela `books` será criada e populada

⚠️ O dump roda apenas **uma vez**, controlado pela tabela `__initialized`.

---

## 🔥 Resetar o banco (se necessário)

Se der erro de dados duplicados ou quiser resetar:

```sql
DROP DATABASE book_shop;
```

Depois rode o servidor novamente.


