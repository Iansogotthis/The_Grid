// Import required packages
const express = require("express");
const bodyParser = require("body-parser");
const mariadb = require("mariadb");
const cors = require("cors");
const path = require("path");
require("dotenv").config(); // Load environment variables from .env file

// Initialize Express application
const app = express();
const port = process.env.PORT || 3000; // Define the port for the server

// Middleware setup
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(bodyParser.json()); // Parse incoming request bodies in JSON format

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));

// Setup MariaDB connection pool
const pool = mariadb.createPool({
  host: process.env.DB_HOST, // Database host
  user: process.env.DB_USER, // Database user
  password: process.env.DB_PASSWORD, // Database password
  database: process.env.DB_NAME, // Database name
  port: process.env.DB_PORT, // Database port
  connectionLimit: 5 // Maximum number of connections in the pool
});

// API Routes

/**
 * Route to create a new square
 * This endpoint creates a new square in the database with the provided data.
 */
app.post("/squares", async (req, res) => {
  const {
    title,
    plane,
    purpose,
    delineator,
    notations,
    details,
    extraData,
    class: squareClass,
    parent,
    depth,
    name,
    size,
    color,
    type,
    parent_id
  } = req.body;
  const query = `INSERT INTO squares (title, plane, purpose, delineator, notations, details, extraData, class, parent, depth, name, size, color, type, parent_id)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  try {
    const conn = await pool.getConnection(); // Get a connection from the pool
    const result = await conn.query(query, [
      title,
      plane,
      purpose,
      delineator,
      notations,
      details,
      extraData,
      squareClass,
      parent,
      depth,
      name,
      size,
      color,
      type,
      parent_id
    ]);
    conn.release(); // Release the connection back to the pool
    res.status(201).json({ id: result.insertId }); // Respond with the ID of the created square
  } catch (err) {
    console.error('Error creating square:', err); // Log the error for debugging purposes
    res.status(500).json({ error: 'Internal Server Error' }); // Handle errors and respond with a 500 status
  }
});

/**
 * Route to get all squares
 * This endpoint retrieves and returns all squares from the database.
 */
app.get("/squares", async (req, res) => {
  const query = "SELECT * FROM squares";
  try {
    const conn = await pool.getConnection(); // Get a connection from the pool
    const results = await conn.query(query); // Execute the query to retrieve all squares
    conn.release(); // Release the connection back to the pool
    res.status(200).json(results); // Respond with the retrieved squares
  } catch (err) {
    console.error('Error fetching squares:', err); // Log the error for debugging purposes
    res.status(500).json({ error: 'Internal Server Error' }); // Handle errors and respond with a 500 status
  }
});

/**
 * Route to get a single square by ID
 * This endpoint retrieves a square from the database based on the provided ID.
 */
app.get("/squares/:id", async (req, res) => {
  const { id } = req.params;
  const query = "SELECT * FROM squares WHERE id = ?";
  try {
    const conn = await pool.getConnection(); // Get a connection from the pool
    const results = await conn.query(query, [id]); // Execute the query to retrieve the square by ID
    conn.release(); // Release the connection back to the pool
    if (results.length === 0) {
      return res.status(404).json({ error: "Square not found" }); // Respond with a 404 status if the square is not found
    }
    res.status(200).json(results[0]); // Respond with the retrieved square
  } catch (err) {
    console.error('Error fetching square by ID:', err); // Log the error for debugging purposes
    res.status(500).json({ error: 'Internal Server Error' }); // Handle errors and respond with a 500 status
  }
});

/**
 * Route to update a square
 * This endpoint updates an existing square in the database based on the provided ID and data.
 */
app.put("/squares/:id", async (req, res) => {
  const { id } = req.params;
  const {
    title,
    plane,
    purpose,
    delineator,
    notations,
    details,
    extraData,
    class: squareClass,
    parent,
    depth,
    name,
    size,
    color,
    type,
    parent_id
  } = req.body;
  const query = `
    UPDATE squares 
    SET title = ?, plane = ?, purpose = ?, delineator = ?, notations = ?, details = ?, extraData = ?, class = ?, parent = ?, depth = ?, name = ?, size = ?, color = ?, type = ?, parent_id = ?
    WHERE id = ?
  `;
  try {
    const conn = await pool.getConnection(); // Get a connection from the pool
    await conn.query(query, [
      title,
      plane,
      purpose,
      delineator,
      notations,
      details,
      extraData,
      squareClass,
      parent,
      depth,
      name,
      size,
      color,
      type,
      parent_id,
      id
    ]); // Execute the update query
    conn.release(); // Release the connection back to the pool
    res.status(200).json({ message: "Square updated successfully" }); // Respond with a success message
  } catch (err) {
    console.error('Error updating square:', err); // Log the error for debugging purposes
    res.status(500).json({ error: 'Internal Server Error' }); // Handle errors and respond with a 500 status
  }
});

/**
 * Route to delete a square
 * This endpoint deletes a square from the database based on the provided ID.
 */
app.delete("/squares/:id", async (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM squares WHERE id = ?";
  try {
    const conn = await pool.getConnection(); // Get a connection from the pool
    await conn.query(query, [id]); // Execute the delete query
    conn.release(); // Release the connection back to the pool
    res.status(200).json({ message: "Square deleted successfully" }); // Respond with a success message
  } catch (err) {
    console.error('Error deleting square:', err); // Log the error for debugging purposes
    res.status(500).json({ error: 'Internal Server Error' }); // Handle errors and respond with a 500 status
  }
});

// Serve static HTML pages

/**
 * Route to serve the scaled view page
 * This route serves the scaled_view.html file from the 'public' directory.
 */
app.get("/scaled_view.html", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "scaled_view.html"));
});

/**
 * Route to serve the scoped view page
 * This route serves the scoped_view.html file from the 'public' directory.
 */
app.get("/scoped_view.html", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "scoped_view.html"));
});

/**
 * Route to serve the form page
 * This route serves the form_page.html file from the 'public' directory.
 */
app.get("/form_page.html", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "form_page.html"));
});

/**
 * Default Route
 * This route serves the index.html file from the 'public' directory.
 */
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Start the server and listen on the defined port
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
