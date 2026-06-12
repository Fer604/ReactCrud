import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import db from '../db/config.js';

const app = express();
app.use(cors());
app.use(express.json());

// Segredo do JWT (hardcoded só pra simplicidade do trabalho)
const JWT_SECRET = 'minha-chave-super-secreta';

// ---------- Middlewares de autenticação ----------
function auth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Token não enviado' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Token inválido' });
  }
}

function adminOnly(req, res, next) {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Acesso restrito ao admin' });
  }
  next();
}

// ---------- Cadastro / Login ----------
app.post('/register', (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Preencha todos os campos' });
  }
  try {
    const result = db
      .prepare('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)')
      .run(name, email, password, 'user');
    res.status(201).json({ id: result.lastInsertRowid });
  } catch {
    res.status(400).json({ error: 'E-mail já cadastrado' });
  }
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const user = db
    .prepare('SELECT * FROM users WHERE email = ? AND password = ?')
    .get(email, password);

  if (!user) return res.status(401).json({ error: 'E-mail ou senha inválidos' });

  const token = jwt.sign(
    { id: user.id, name: user.name, role: user.role },
    JWT_SECRET,
    { expiresIn: '8h' }
  );
  res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
});

// ---------- Catálogo de livros + busca avançada ----------
// GET /books?q=termo  -> busca por título, autor ou ISBN
app.get('/books', (req, res) => {
  const q = (req.query.q || '').trim();
  if (q) {
    const like = `%${q}%`;
    const rows = db
      .prepare(
        `SELECT * FROM books
         WHERE title LIKE ?
            OR author_fname LIKE ?
            OR author_lname LIKE ?
            OR isbn LIKE ?
         ORDER BY title`
      )
      .all(like, like, like, like);
    return res.json(rows);
  }
  const rows = db.prepare('SELECT * FROM books ORDER BY title').all();
  res.json(rows);
});

app.get('/books/:id', (req, res) => {
  const book = db.prepare('SELECT * FROM books WHERE book_id = ?').get(req.params.id);
  if (!book) return res.status(404).json({ error: 'Livro não encontrado' });
  res.json([book]);
});

app.post('/books', (req, res) => {
  const d = req.body;
  const result = db
    .prepare(
      `INSERT INTO books (title, author_fname, author_lname, isbn, released_year, stock_quantity, pages)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    )
    .run(
      d.title,
      d.author_fname,
      d.author_lname,
      d.isbn,
      Number(d.released_year) || null,
      Number(d.stock_quantity) || null,
      Number(d.pages) || null
    );
  res.status(201).json({ bookId: result.lastInsertRowid });
});

app.patch('/books/:id', (req, res) => {
  const d = req.body;
  db.prepare(
    `UPDATE books
     SET title=?, author_fname=?, author_lname=?, isbn=?, released_year=?, stock_quantity=?, pages=?
     WHERE book_id=?`
  ).run(
    d.title,
    d.author_fname,
    d.author_lname,
    d.isbn,
    Number(d.released_year) || null,
    Number(d.stock_quantity) || null,
    Number(d.pages) || null,
    req.params.id
  );
  res.status(200).json({ bookId: req.params.id });
});

app.delete('/books/:id', (req, res) => {
  db.prepare('DELETE FROM books WHERE book_id = ?').run(req.params.id);
  res.sendStatus(204);
});

// ---------- Empréstimos do usuário logado ----------
// Lista os empréstimos do próprio usuário
app.get('/loans/me', auth, (req, res) => {
  const loans = db
    .prepare(
      `SELECT l.id, l.borrowed_at, l.due_date,
              b.book_id, b.title AS book_title,
              b.author_fname, b.author_lname
       FROM loans l
       JOIN books b ON b.book_id = l.book_id
       WHERE l.user_id = ?
       ORDER BY l.borrowed_at DESC`
    )
    .all(req.user.id);
  res.json(loans);
});

// Pega um livro emprestado
app.post('/loans', auth, (req, res) => {
  const { book_id } = req.body;
  const book = db.prepare('SELECT * FROM books WHERE book_id = ?').get(book_id);
  if (!book) return res.status(404).json({ error: 'Livro não encontrado' });
  if ((book.stock_quantity ?? 0) <= 0) {
    return res.status(400).json({ error: 'Livro sem estoque disponível' });
  }

  const borrowed = new Date();
  const due = new Date();
  due.setDate(due.getDate() + 14);
  const fmt = (d) => d.toISOString().slice(0, 10);

  db.prepare(
    'INSERT INTO loans (book_id, user_id, borrowed_at, due_date) VALUES (?, ?, ?, ?)'
  ).run(book_id, req.user.id, fmt(borrowed), fmt(due));

  db.prepare('UPDATE books SET stock_quantity = stock_quantity - 1 WHERE book_id = ?').run(
    book_id
  );

  res.status(201).json({ ok: true });
});

// Devolve um livro (só o dono do empréstimo)
app.delete('/loans/:id', auth, (req, res) => {
  const loan = db.prepare('SELECT * FROM loans WHERE id = ?').get(req.params.id);
  if (!loan) return res.status(404).json({ error: 'Empréstimo não encontrado' });
  if (loan.user_id !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Você não pode devolver este empréstimo' });
  }

  db.prepare('DELETE FROM loans WHERE id = ?').run(req.params.id);
  db.prepare('UPDATE books SET stock_quantity = stock_quantity + 1 WHERE book_id = ?').run(
    loan.book_id
  );
  res.sendStatus(204);
});

// ---------- Painel admin (protegido por JWT + role admin) ----------
app.get('/admin/users', auth, adminOnly, (req, res) => {
  const users = db.prepare('SELECT id, name, email, role FROM users').all();
  res.json(users);
});

app.get('/admin/loans', auth, adminOnly, (req, res) => {
  const loans = db
    .prepare(
      `SELECT l.id, l.borrowed_at, l.due_date,
              b.title AS book_title,
              u.name AS user_name
       FROM loans l
       JOIN books b ON b.book_id = l.book_id
       JOIN users u ON u.id = l.user_id
       ORDER BY l.borrowed_at DESC`
    )
    .all();
  res.json(loans);
});

app.get('/admin/stats', auth, adminOnly, (req, res) => {
  const books = db.prepare('SELECT COUNT(*) AS n FROM books').get().n;
  const users = db.prepare('SELECT COUNT(*) AS n FROM users').get().n;
  const loans = db.prepare('SELECT COUNT(*) AS n FROM loans').get().n;
  res.json({ books, users, loans });
});

app.listen(3001, () => {
  console.log('Server running on port 3001');
});
