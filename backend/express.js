const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Enable CORS to allow requests from your frontend
app.use(cors());

// Middleware to parse incoming JSON requests
app.use(bodyParser.json());

// MySQL database connection
const db = mysql.createConnection({
  host: 'localhost', // MySQL host
  user: 'root',      // Your MySQL username
  password: '',      // Your MySQL password
  database: 'expense_tracker' // Database name
});

// Connect to MySQL database
db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the MySQL database');
});

// CRUD Routes

// 1. Get all transactions (READ)
app.get('/transactions', (req, res) => {
  db.query('SELECT * FROM transactions', (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch transactions: ' + err.message });
    }
    res.json(results);
  });
});

// 2. Add a new transaction (CREATE)
app.post('/transactions', (req, res) => {
  const { text, amount } = req.body; // Expecting text and amount from the request body
  
  if (!text || !amount) {
    return res.status(400).json({ error: 'Text and amount are required' });
  }

  const query = 'INSERT INTO transactions (text, amount) VALUES (?, ?)';

  db.query(query, [text, amount], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to add transaction: ' + err.message });
    }
    res.json({ id: results.insertId, text, amount });
  });
});

// 3. Delete a transaction (DELETE)
app.delete('/transactions/:id', (req, res) => {
  const { id } = req.params; // Get the ID from the URL parameter
  
  if (!id) {
    return res.status(400).json({ error: 'Transaction ID is required' });
  }

  const query = 'DELETE FROM transactions WHERE id = ?';

  db.query(query, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to delete transaction: ' + err.message });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    res.json({ message: 'Transaction deleted' });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
