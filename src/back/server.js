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


//exemplo de postgress

// app.post('/books', async (req, res) => {  
//   let data = req.body;

//   const newBook = { 
//     title: data.title,
//     author_fname: data.author_fname,
//     author_lname: data.author_lname,
//     released_year: data.released_year,
//     stock_quantity: data.stock_quantity,
//     pages:data.pages
//   };

//   try {
//     const result = await db.query('\
//         INSERT INTO books.data( \
//           title, \
//           author_fname, \
//           author_lname, \
//           released_year, \
//           stock_quantity, \
//           pages\
//         ) \
//         VALUES($1, $2, $3, $4, $5, $6) \
//         RETURNING book_id;', 
//       [
//         newBook.title, 
//         newBook.author_fname, 
//         newBook.author_lname, 
//         newBook.released_year, 
//         newBook.stock_quantity
//       ]);

//     res.status(201).json({ BookID: result.rows[0].book_id });
//   }
//   catch (err) {
//     res.status(500).send(err.message);
//   }
// });



app.listen(3001, () => {
  console.log('Server running on port 3001');
});