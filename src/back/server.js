import express from 'express';
import cors from 'cors';
import db from '../db/config.js';

const app = express();
app.use(cors());
app.use(express.json());

try {
  const connection = await db.getConnection();
  console.log('MySQL connected');
  connection.release();
} catch (err) {
  console.error(err);
}

app.get('/books', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM books');
    res.json(rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
});


app.post('/books', async (req, res) => {
  const data = req.body;

  try {
    const [result] = await db.query(
      `INSERT INTO books 
      (title, author_fname, author_lname, released_year, stock_quantity, pages)
      VALUES (?, ?, ?, ?, ?, ?)`,
      [
        data.title,
        data.author_fname,
        data.author_lname,
        data.released_year,
        data.stock_quantity,
        data.pages
      ]
    );

    res.status(201).json({ bookId: result.insertId });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.patch('/users/:user_id', async (req, res) => {
  const {user_id} = req.params;
  let data = req.body;

  const newUser = { 
    name: data.name,
    cpf: data.cpf,
    age: data.age,
    telephone: data.number,
    email: data.email
  };

  try {
    await db.query('update books set title =?, author_fname=?, author_lname=?, released_year=?, stock_quantity=?, pages=? where book_id = ?',
      [
        data.bookId,
        data.title,
        data.author_fname,
        data.author_lname,
        data.released_year,
        data.stock_quantity,
        data.pages
      ]);

    res.status(204).json();
  }
  catch (err) {
    res.status(500).send(err.message);
  }
});



app.listen(3001, () => {
  console.log('Server running on port 3001');
});