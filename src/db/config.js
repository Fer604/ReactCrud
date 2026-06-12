import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Banco SQLite simples, salvo em um arquivo local
const db = new DatabaseSync(path.join(__dirname, 'biblioteca.db'));

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'user'
  );

  CREATE TABLE IF NOT EXISTS books (
    book_id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    author_fname TEXT,
    author_lname TEXT,
    isbn TEXT,
    released_year INTEGER,
    stock_quantity INTEGER,
    pages INTEGER
  );

  CREATE TABLE IF NOT EXISTS loans (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    book_id INTEGER,
    user_id INTEGER,
    borrowed_at TEXT,
    due_date TEXT
  );
`);

// Seed só na primeira execução (quando não existir nenhum usuário)
const { total } = db.prepare('SELECT COUNT(*) AS total FROM users').get();

if (total === 0) {
  // Usuários (senhas em texto puro só pra simplicidade do trabalho)
  const insertUser = db.prepare(
    'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)'
  );
  insertUser.run('Administrador', 'admin@biblioteca.com', 'admin123', 'admin');
  insertUser.run('Maria Souza', 'maria@email.com', '123456', 'user');
  insertUser.run('João Pereira', 'joao@email.com', '123456', 'user');

  // Livros (dados hardcoded)
  const insertBook = db.prepare(
    `INSERT INTO books (title, author_fname, author_lname, isbn, released_year, stock_quantity, pages)
     VALUES (?, ?, ?, ?, ?, ?, ?)`
  );
  const books = [
    ['American Gods', 'Neil', 'Gaiman', '9780380789030', 2001, 12, 465],
    ['Coraline', 'Neil', 'Gaiman', '9780380807345', 2003, 10, 208],
    ['Interpreter of Maladies', 'Jhumpa', 'Lahiri', '9780395927205', 1996, 7, 198],
    ['A Hologram for the King', 'Dave', 'Eggers', '9781938073489', 2012, 5, 352],
    ['The Circle', 'Dave', 'Eggers', '9780385351393', 2013, 6, 504],
    ['The Amazing Adventures of Kavalier & Clay', 'Michael', 'Chabon', '9780312282998', 2000, 4, 634],
    ['Just Kids', 'Patti', 'Smith', '9780060936228', 2010, 8, 304],
    ['White Noise', 'Don', 'DeLillo', '9780140077025', 1985, 3, 320],
    ['Cannery Row', 'John', 'Steinbeck', '9780142000687', 1945, 9, 181],
    ['Oblivion: Stories', 'David', 'Foster Wallace', '9780316010764', 2004, 2, 329],
  ];
  for (const b of books) insertBook.run(...b);

  // Empréstimos de exemplo
  const insertLoan = db.prepare(
    'INSERT INTO loans (book_id, user_id, borrowed_at, due_date) VALUES (?, ?, ?, ?)'
  );
  insertLoan.run(1, 2, '2026-06-01', '2026-06-15');
  insertLoan.run(3, 3, '2026-06-05', '2026-06-19');
  insertLoan.run(8, 2, '2026-06-08', '2026-06-22');

  console.log('Banco SQLite criado e populado com dados iniciais.');
}

export default db;
