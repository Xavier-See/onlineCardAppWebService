// Include the require packages
const express = require('express');
const mysql = require('mysql2/promise')
require('dotenv').config();
const port = 3000;

// database config
const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitforConnections: true,
    connectionLimit: 100,
    queueLimit: 0
};

// Initialize the Express app
const app = express();

// Helps the app read JSON
app.use(express.json());

// Start the Server
app.listen(port, () => {
    console.log('Server is running on ', port);
});

// Example Route: Get all cards
app.get('/allpokemon', async (req, res) => {
    try {
        let connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT * FROM wk8ex.cards');
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error for allpokemon' });
    }
});

// Example Route: Create a new card
app.post('/addpokemon', async (req, res) => {
    const { pokemon_name, pokemon_pic } = req.body;
    try {
        let connection = await mysql.createConnection(dbConfig);
        await connection.execute('INSERT INTO cards (pokemon_name, pokemon_pic) VALUES (?, ?)', [pokemon_name, pokemon_pic]);
        res.status(201).json({ message: 'Card ' +pokemon_name+ ' added successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error - could not add card '+pokemon_name });
    }
});
