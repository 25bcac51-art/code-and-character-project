const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;

// Helps the server read the data from your forms
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname)));

// Creates a NEW database specifically for this project
const db = new sqlite3.Database('./visitors_study.db');

db.serialize(() => {
    // TABLE 1: This stores people who register at the front gate
    db.run(`CREATE TABLE IF NOT EXISTS visitors (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        phone TEXT,
        email TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // TABLE 2: For your final contact form
    db.run(`CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        email TEXT,
        message TEXT
    )`);
});

// The Gatekeeper: Saves visitor info when they "Enter the Study"
app.post('/api/visitor-gate', (req, res) => {
    const { name, phone, email } = req.body;
    console.log("New Visitor Logged:", req.body);
    const sql = `INSERT INTO visitors (name, phone, email) VALUES (?, ?, ?)`;
    
    db.run(sql, [name, phone, email], function(err) {
        if (err) return res.status(500).json({ success: false });
        res.json({ success: true, visitorName: name });
    });
});

app.listen(PORT, () => {
    console.log(`Connected to the SQLite database.`);
    console.log(`Server running at http://localhost:${PORT}`);
});

// Endpoint for the Contact Form
app.post('/api/contact', (req, res) => {
    const { name, email, message } = req.body;
    console.log("New Review Received:", req.body);
    const sql = `INSERT INTO messages (name, email, message) VALUES (?, ?, ?)`;
    
    db.run(sql, [name, email, message], function(err) {
        if (err) return res.status(500).json({ success: false });
        res.json({ success: true });
    });
});