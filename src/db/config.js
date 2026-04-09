import dotenv from 'dotenv';
import mysql from 'mysql2/promise';
import fs from 'fs';

dotenv.config();


// conexão sem database
const connection = await mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  multipleStatements:true,
});

// cria o banco se não existir
await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`);

console.log("Database garantido");

// usa o banco
await connection.query(`USE ${process.env.DB_NAME}`);

// lê o arquivo SQL
const sql = fs.readFileSync('src/db/init.sql', 'utf-8');

// executa o dump
await connection.query(`
  CREATE TABLE IF NOT EXISTS __initialized (id INT PRIMARY KEY)
`);

const [rows] = await connection.query(`SELECT * FROM __initialized`);

if (rows.length === 0) {
  await connection.query(sql);
  await connection.query(`INSERT INTO __initialized VALUES (1)`);
  console.log("Dump aplicado (primeira vez)");
}

await connection.end();



const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT, 10),
  multipleStatements:true,
});

export default db;