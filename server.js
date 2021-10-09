//dependencies and PORT setup
const { json } = require("express");
const express = require("express");
const PORT = process.env.PORT || 3001;
const app = express();
const mysql = require('mysql2');
const inputCheck = require('./utils/inputCheck');

//express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//connect server to MySQL Database
const db = mysql.createConnection(
    {
        host: 'localhost',
        //your SQL username
        user: 'root',
        password: 'k8HYz%H7',
        database: 'election'
    },
    console.log('Connected to the election database')
);





//routes






//GET all candidates from candidates database as objects in array
app.get('/api/candidates', (req, res) => {
    const sql = `SELECT candidates.*, parties.name 
    AS party_name 
    FROM candidates 
    LEFT JOIN parties 
    ON candidates.party_id = parties.id`;

    db.query(sql, (err, rows) => {
        if (err) {
            res.status(500).json({ eror: err.message });
            return;
        }
        res.json({
            message: 'sucess',
            data: rows
        });
    });
});

//GET a single candidate as object from candidates database
app.get('/api/candidate/:id', (req, res) => {
    const sql = `SELECT candidates.*, parties.name 
             AS party_name 
             FROM candidates 
             LEFT JOIN parties 
             ON candidates.party_id = parties.id 
             WHERE candidates.id = ?`;
    const params = [req.params.id];

    db.query(sql, params, (err, row) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: row
        });
    });
});



//CREATE a candidate
app.post('/api/candidate', ({ body }, res) => {
    const errors = inputCheck(body, 'first_name', 'last_name', 'industry_connected');
    if (errors) {
        res.status.send(400).json({ eror: errors });
        return;
    }
    const sql = `INSERT INTO candidates (first_name, last_name, industry_connected) VALUES (?,?,?)`;
    const params = [body.first_name, body.last_name, body.industry_connected];
    db.query(sql, params, (err, result) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: body
        });
    });
});





//DELETE  a candidate
app.delete('/api/candidate/:id', (req, res) => {
    const sql = `DELETE FROM candidates WHERE id = ?`;
    params = [req.params.id];

    db.query(sql, params, (err, result) => {
        if (err) {
            res.statusMessage(404).json({ error: res.message });
        } else if (!result.affectedRows) {
            res.json({
                message: 'Candidate not found',
            });
        } else {
            res.json({
                message: 'deleted',
                changes: result.affectedRows,
                id: req.params.id
            });
        }
    });
});

// Default response for a bad request (Not Found)
app.use((req, res) => {
    res.status(404).end();
});


//start express server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});