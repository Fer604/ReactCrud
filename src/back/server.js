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


//get all
app.get('/books', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM books');
    res.json(rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// GET ONE
app.get("/books/:id", async (req, res) => {
  const id = req.params.id;
    try {
    const result = await db.query("SELECT * FROM books WHERE book_id = ?", [id]);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('deu ruim ao getar um:',err);
    res.status(500).json({error:err.message});
  }
});

//add
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

//UPDATE
app.patch("/books/:id", async (req, res) => {
  const id = req.params.id;
  const { title, author_fname, author_lname } = req.body;

  try {
    const [result] = await db.query(
      'UPDATE books SET title=?, author_fname=?, author_lname=? WHERE book_id=?',
      [
        title,
        author_fname,
        author_lname,
        id]);

    console.log('Livro atualizado com ID:', id);
    res.sendStatus(201).json({bookId:id});
  } catch (err) {
    console.error('deu ruim ao updatear:',err);
    res.status(500).json({error:err.message});
  }
});



//DELETE
app.delete('/books/:id', async (req, res) => {
  const id = req.params.id;

  try {
    await db.query('DELETE FROM books WHERE book_id = ?', [id]);

    console.log('Livro deletado com ID:', id);
    res.sendStatus(204);
  } catch (err) {
    console.error('Erro ao deletar:', err);
    res.status(500).json({ error: err.message });
  }
});



app.listen(3001, () => {
  console.log('Server running on port 3001');
});