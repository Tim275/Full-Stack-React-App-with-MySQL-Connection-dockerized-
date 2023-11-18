const express = require('express');
const app = express();
const mysql = require('mysql2');

const port = 3001;
const cors = require('cors'); // CROSS ORIGIN MIDDLEWARE, to accept  request from ur frontend


app.use(cors()); // fürs CORS problem
require('dotenv').config();  // fürs .env file


const db = mysql.createConnection({ // verbindet mit der Datenbank im netzwerk
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE
});

db.connect((err) => {
  if (err) throw err;
  console.log('Connected to the database');
});

app.get('/api/products', (req, res) => { // from table
  db.query('SELECT * FROM products', (err, results) => {
    if (err) throw err;
    res.send(results);
  });
});

app.listen(port, () => {
  console.log(`Server laeft auf PORT:${port}`);
});