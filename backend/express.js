const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios'); // Import axios for OpenAI

const app = express();
const port = 3000;

// Enable CORS to allow requests from your frontend
app.use(cors());

// Middleware to parse incoming JSON requests
app.use(bodyParser.json());

// MySQL database connection
require('dotenv').config();

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

// ... your other code ...

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
  const userId = req.headers.authorization;
  console.log('GET /transactions - userId:', userId);

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  db.query('SELECT * FROM transactions WHERE userId = ?', [userId], (err, results) => {
    if (err) {
      console.error('GET /transactions - Error:', err);
      return res.status(500).json({ error: 'Failed to fetch transactions' });
    }
    const formattedResults = results.map((transaction) => ({
      ...transaction,
      amount: parseFloat(transaction.amount),
    }));
    res.json(formattedResults);
  });
});

// 2. Add a new transaction (CREATE)
app.post('/transactions', (req, res) => {
  console.log('POST /transactions - req.headers:', req.headers); // Log headers
  const userId = req.headers.authorization;
  console.log('POST /transactions - userId:', userId); // Log userId

  if (!userId) {
    console.error('POST /transactions - Unauthorized: Missing userId');
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { text, amount } = req.body;

  if (!text || !amount) {
    console.error('POST /transactions - Bad Request: Missing text or amount');
    return res.status(400).json({ error: 'Text and amount are required' });
  }

  const query = 'INSERT INTO transactions (text, amount, userId) VALUES (?, ?, ?)';
  console.log('POST /transactions - SQL Query:', query);
  console.log('POST /transactions - SQL Values:', [text, amount, userId]);

  db.query(query, [text, amount, userId], (err, results) => {
    if (err) {
      console.error('POST /transactions - Database Error:', err);
      return res.status(500).json({ error: 'Failed to add transaction: ' + err.message });
    }

    // Fetch the newly added transaction to return full details
    db.query('SELECT * FROM transactions WHERE id = ?', [results.insertId], (err, newTransaction) => {
      if (err) {
        console.error('POST /transactions - Database Error (fetch new):', err);
        return res.status(500).json({ error: 'Failed to fetch the new transaction' });
      }
      res.json(newTransaction[0]);
    });
  });
});

// 3. Delete a transaction (DELETE)
app.delete('/transactions/:id', (req, res) => {
  const { id } = req.params;
  const userId = req.headers.authorization;
  console.log('DELETE /transactions - userId:', userId);

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (!id) {
    return res.status(400).json({ error: 'Transaction ID is required' });
  }

  const query = 'DELETE FROM transactions WHERE id = ? AND userId = ?';
  console.log('DELETE /transactions - SQL Query:', query);
  console.log('DELETE /transactions - SQL Values:', [id, userId]);

  db.query(query, [id, userId], (err, results) => {
    if (err) {
      console.error('DELETE /transactions - Database Error:', err);
      return res.status(500).json({ error: 'Failed to delete transaction: ' + err.message });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Transaction not found or unauthorized' });
    }
    res.json({ message: 'Transaction deleted' });
  });
});



// 4. Chatbot Endpoint
app.get('/api/quote', async (req, res) => {
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a financial advisor. Generate a motivation quote by someone famous about finances/investing/making money, and make sure it is proper quote formatting.',
          },
          {
            role: 'user',
            content: 'Generate a quote.',
          },
        ],
        max_tokens: 100,
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.VUE_APP_CHATBOT_TOKEN}`,
        },
      }
    );

    const quote = response.data.choices[0].message.content.trim();
    res.json({ quote });
  } catch (error) {
    console.error('Quote API Error:', error);
    res.status(500).json({ error: 'Failed to generate quote.' });
  }
});


// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});