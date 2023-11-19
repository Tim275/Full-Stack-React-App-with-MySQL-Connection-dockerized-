const express = require('express');
const app = express();
const mysql = require('mysql2/promise');
const cors = require('cors'); // CROSS ORIGIN MIDDLEWARE, to accept  request from ur frontend
const port = 3001;


app.use(cors()); // fürs CORS problem
require('dotenv').config();  // fürs .env file
app.use(express.json());


const db = mysql.createPool({ // verbindet mit der Datenbank im netzwerk
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});


 // fürs lesen
 app.get('/api/products', async (req, res) => {
  const [rows, fields] = await db.execute('SELECT * FROM products');
  res.json(rows);
});


// zum posten
app.post('/api/products', async (req, res) => {
  const { name, description, price, stock } = req.body; // extrahiert name,description,price,stock aus dem body
  try {
    const [result] = await db.execute('INSERT INTO products (name, description, price, stock) VALUES (?, ?, ?, ?)', [name, description, price, stock]);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error beim hinzufügen eines Produktes.' });
  }
});

// PUT = update
app.put('/api/products/:id', async (req, res) => {
  const { name, description, price, stock } = req.body;
  const [result] = await db.execute('UPDATE products SET name = ?, description = ?, price = ?, stock = ? WHERE id = ?', [name, description, price, stock, req.params.id]);
  res.json(result);
});

// fürst löschen
app.delete('/api/products/:id', async (req, res) => {
  const [result] = await db.execute('DELETE FROM products WHERE id = ?', [req.params.id]);
  res.json(result);
});




app.listen(port, () => {
  console.log(`Server laeft auf PORT:${port}`);
});