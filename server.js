// server.js
const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");
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

// Setup MySQL connection pool
/**
 * Establishes a MySQL connection pool with the specified configuration.
 * The connection pool is used to manage and reuse database connections,
 * improving performance and scalability of the application.
 *
 * @param {string} host - The hostname or IP address of the MySQL server.
 * @param {string} user - The username to use for the MySQL connection.
 * @param {string} password - The password to use for the MySQL connection.
 * @param {string} database - The name of the database to connect to.
 * @param {number} port - The port number of the MySQL server.
 * @param {number} connectionLimit - The maximum number of connections in the pool.
 * @returns {Pool} - A MySQL connection pool instance.
 */
const pool = mysql.createPool({
    host: 'e11wl4mksauxgu1w.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
    user: 'hp0lzrzsnuzjl0ei',
    password: 'zvskixvf2bwkvhjh',
    database: 'bfaxn1uhv9udz7ng',
    port: 3306,
    connectionLimit: 5 // Maximum number of connections in the pool
});

// API Routes

/**
 * Route to create a new square
 * This endpoint creates a new square in the database with the provided data.
 */
app.post("/squares", async(req, res) => {
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
        pool.getConnection((err, conn) => {
            if (err) {
                console.error('Error getting connection:', err);
                return res.status(500).json({ error: 'Internal Server Error' });
            }
            conn.query(query, [
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
            ], (error, results) => {
                conn.release();
                if (error) {
                    console.error('Error creating square:', error);
                    return res.status(500).json({ error: 'Internal Server Error' });
                }
                res.status(201).json({ id: results.insertId });
            });
        });
    } catch (err) {
        console.error('Error creating square:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

/**
 * Route to get all squares
 * This endpoint retrieves and returns all squares from the database.
 */
app.get("/squares", async(req, res) => {
    const query = "SELECT * FROM squares";
    try {
        pool.getConnection((err, conn) => {
            if (err) {
                console.error('Error getting connection:', err);
                return res.status(500).json({ error: 'Internal Server Error' });
            }
            conn.query(query, (error, results) => {
                conn.release();
                if (error) {
                    console.error('Error fetching squares:', error);
                    return res.status(500).json({ error: 'Internal Server Error' });
                }
                res.status(200).json(results);
            });
        });
    } catch (err) {
        console.error('Error fetching squares:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

/**
 * Route to get a single square by ID
 * This endpoint retrieves a square from the database based on the provided ID.
 */
app.get("/squares/:id", async(req, res) => {
    const { id } = req.params;
    const query = "SELECT * FROM squares WHERE id = ?";
    try {
        pool.getConnection((err, conn) => {
            if (err) {
                console.error('Error getting connection:', err);
                return res.status(500).json({ error: 'Internal Server Error' });
            }
            conn.query(query, [id], (error, results) => {
                conn.release();
                if (error) {
                    console.error('Error fetching square by ID:', error);
                    return res.status(500).json({ error: 'Internal Server Error' });
                }
                if (results.length === 0) {
                    return res.status(404).json({ error: "Square not found" });
                }
                res.status(200).json(results[0]);
            });
        });
    } catch (err) {
        console.error('Error fetching square by ID:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

/**
 * Route to update a square
 * This endpoint updates an existing square in the database based on the provided ID and data.
 */
app.put("/squares/:id", async(req, res) => {
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
        pool.getConnection((err, conn) => {
            if (err) {
                console.error('Error getting connection:', err);
                return res.status(500).json({ error: 'Internal Server Error' });
            }
            conn.query(query, [
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
            ], (error) => {
                conn.release();
                if (error) {
                    console.error('Error updating square:', error);
                    return res.status(500).json({ error: 'Internal Server Error' });
                }
                res.status(200).json({ message: "Square updated successfully" });
            });
        });
    } catch (err) {
        console.error('Error updating square:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

/**
 * Route to delete a square
 * This endpoint deletes a square from the database based on the provided ID.
 */
app.delete("/squares/:id", async(req, res) => {
    const { id } = req.params;
    const query = "DELETE FROM squares WHERE id = ?";
    try {
        pool.getConnection((err, conn) => {
            if (err) {
                console.error('Error getting connection:', err);
                return res.status(500).json({ error: 'Internal Server Error' });
            }
            conn.query(query, [id], (error) => {
                conn.release();
                if (error) {
                    console.error('Error deleting square:', error);
                    return res.status(500).json({ error: 'Internal Server Error' });
                }
                res.status(200).json({ message: "Square deleted successfully" });
            });
        });
    } catch (err) {
        console.error('Error deleting square:', err);
        res.status(500).json({ error: 'Internal Server Error' });
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