const express = require('express');
const app = express();
const port = 3000;
const { Pool } = require('pg');

const pool = new Pool({
  host: "52.142.60.121",
  port: 5432,
  user: "postgres",
  password: "postgres",
  database: "GRB_db",
});

app.use(express.json());

// Read operation (GET)
app.get('/data', (req, res) => {
  pool.query('SELECT * FROM author', (err, result) => {
    if (err) {
      console.error('Error executing query', err);
      res.status(500).send('Error fetching data');
    } else {
      res.json(result.rows);
    }
  });
});

// Create operation (POST)
app.post('/data/:author_id', (req, res) => {
    // Retrieve the maximum ID from the table
    const query_2 = 'SELECT MAX(id) AS latest_id FROM author';
    const result =  client.query(query);
    const latestId = result.rows[0].latest_id;

    console.log('Latest ID:', latestId);

    const { name, year_born } = req.body;
    const query = 'INSERT INTO author (name, year_born, author_id) VALUES ($1, $2, $3) RETURNING *';
    const values = [name, year_born, latestId + 1];
  
    pool.query(query, values, (err, result) => {
      if (err) {
        console.error('Error executing query', err);
        res.status(500).send('Error creating data');
      } else {
        const insertedData = result.rows[0];
        res.status(201).json(insertedData); // Data created successfully
      }
    });
  });
  

// Edit operation (PUT)
app.put('/data/:author_id', (req, res) => {
  const { author_id } = req.params;
  const { name, year_born } = req.body;
  const query = 'UPDATE author SET name = $1, year_born = $2 WHERE author_id = $3';
  const values = [name, year_born, author_id];

  pool.query(query, values, (err) => {
    if (err) {
      console.error('Error executing query', err);
      res.status(500).send('Error updating data');
    } else {
      res.send('Data updated successfully');
    }
  });
});

// Delete operation (DELETE)
app.delete('/data/:author_id', (req, res) => {
  const { author_id } = req.params;
  const query = 'DELETE FROM author WHERE author_id = $1';
  const values = [author_id];

  pool.query(query, values, (err) => {
    if (err) {
      console.error('Error executing query', err);
      res.status(500).send('Error deleting data');
    } else {
      res.send('Data deleted successfully');
    }
  });
});

// Serve the HTML file
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
