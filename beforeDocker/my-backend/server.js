const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
app.use(cors()); // Enable CORS
app.use(express.json());

app.use(express.json());
let pool = mysql.createPool({
    host: 'localhost', 
    user: 'root', 
    password: '', 
    database: 'my_database', 
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

  // fürs lesen
  app.get('/api/products', async (req, res) => {
    const [rows, fields] = await pool.execute('SELECT * FROM products');
    res.json(rows);
  });
  

  // zum posten
  app.post('/api/products', async (req, res) => {
    const { name, description, price, stock } = req.body; // extrahiert name,description,price,stock aus dem body
    try {
      const [result] = await pool.execute('INSERT INTO products (name, description, price, stock) VALUES (?, ?, ?, ?)', [name, description, price, stock]);
      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error beim hinzufügen eines Produktes.' });
    }
  });
  
  // PUT = update
  app.put('/api/products/:id', async (req, res) => {
    const { name, description, price, stock } = req.body;
    const [result] = await pool.execute('UPDATE products SET name = ?, description = ?, price = ?, stock = ? WHERE id = ?', [name, description, price, stock, req.params.id]);
    res.json(result);
  });
  
  // fürst löschen
  app.delete('/api/products/:id', async (req, res) => {
    const [result] = await pool.execute('DELETE FROM products WHERE id = ?', [req.params.id]);
    res.json(result);
  });




app.listen(3001, () => console.log('Server ist auf Port 3001'));


