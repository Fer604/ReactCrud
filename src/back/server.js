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
app.get("/books/:id", (req, res) => {
  const id = req.params.id;
  db.query("SELECT * FROM books WHERE book_id = ?", [id], (err, result) => {
    if (err) return res.json(err);
    res.json(result[0]);
  });
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
app.put("/books/:id", (req, res) => {
  const id = req.params.id;
  const { title, author_fname, author_lname } = req.body;

  db.query(
    "UPDATE books SET title=?, author_fname=?, author_lname=? WHERE book_id=?",
    [title, author_fname, author_lname, id],
    (err, result) => {
      if (err) return res.json(err);
      res.json("Livro atualizado");
    }
  );
});



//DELETE
app.delete("/books/:id", (req, res) => {
  const id = req.params.id;

  db.query("DELETE FROM books WHERE book_id=?", [id], (err, result) => {
    if (err) return res.json(err);
    res.json("Livro deletado");
  });
});



app.listen(3001, () => {
  console.log('Server running on port 3001');
});