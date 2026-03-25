// server.js
import express, { json } from 'express';
import { createConnection } from 'mysql2';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(json());

// MySQL connection
const db = createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'book_shop'
});

db.connect(err => {
  if (err) throw err;
  console.log('MySQL connected');
});

// Example route
app.get('/users', (req, res) => {
  db.query('SELECT * FROM books', (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});



app.listen(3001, () => {
  console.log('Server running on port 3001');
});