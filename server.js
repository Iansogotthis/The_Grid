const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const path = require('path');

const app = express();
const port = 3000;

// PostgreSQL configuration
const pool = new Pool({
  user: 'your_username',
  host: 'localhost',
  database: 'your_database_name',
  password: 'your_password',
  port: 5432,
});

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files (e.g., HTML, CSS, client-side JavaScript)
app.use(express.static(path.join(__dirname, 'public')));

// Define routes

// Save square data route
app.post('/squares', async (req, res) => {
  const { name, size, color, type, parent_id } = req.body;

  try {
    const client = await pool.connect();

    // Insert square data into PostgreSQL squares table
    const query = `
      INSERT INTO squares (name, size, color, type, parent_id)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    const values = [name, size, color, type, parent_id];

    const result = await client.query(query, values);
    const savedSquare = result.rows[0];

    client.release();

    res.status(201).json(savedSquare);
  } catch (err) {
    console.error('Error executing query', err);
    res.status(500).send('Error saving square data');
  }
});

// Get data route
app.get('/get_data', async (req, res) => {
  const { squareClass, parent, depth } = req.query;

  try {
    const client = await pool.connect();

    // Query to retrieve data based on squareClass, parent, and depth
    const query = `
      SELECT *
      FROM squares
      WHERE type = $1 AND parent_id = $2 AND depth = $3
    `;
    const values = [squareClass, parent, depth];

    const result = await client.query(query, values);
    const squaresData = result.rows;

    client.release();

    res.status(200).json(squaresData);
  } catch (err) {
    console.error('Error executing query', err);
    res.status(500).send('Error fetching square data');
  }
});

// Save data endpoint (new endpoint)
app.post('/save_data', (req, res) => {
  const squareData = req.body;

  // Assuming you want to insert data into the squares table
  const query = 'INSERT INTO squares (name, size, color, type, parent_id) VALUES ($1, $2, $3, $4, $5)';
  const { name, size, color, type, parent_id } = squareData;

  pool.query(query, [name, size, color, type, parent_id], (err) => {
    if (err) {
      console.error('Error saving data to PostgreSQL:', err);
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ message: 'Data saved successfully' });
  });
});

// Handle errors for unsupported routes
app.use((req, res) => {
  res.status(404).send('404: Page not found');
});

// Error handler middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
