const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const app = express();
const messageRoutes = require('./routes/messages')
const messageQuery = require('./queries/messages')




const PORT = process.env.PORT || 5000;

app.use(cors());

// MySQL connection configuration
const connection = mysql.createConnection({
    user: 'acore',
    host: '127.0.0.1',
    database: 'chatbox',
    password: 'acore',
});

// Connect to the MySQL database
connection.connect((err) => {
    if (err) {
      console.error('Error connecting to MySQL database:', err.stack);
      // Send an HTTP response indicating the error
      res.status(500).json({ error: 'Error connecting to database' });
      return;
    }
    console.log('Connected to MySQL database as id', connection.threadId);
});


app.use((req, res, next) => {
    req.db = connection;
    next();
});


// Define route to fetch data from MySQL
app.get('/chatbox/data', (req, res) => {
    const queryString = 'SELECT * FROM users'; // Assuming 'users' is the table name
    // Execute the query
    connection.query(queryString, (err, result) => {
        if (err) {
            console.error('Error executing query:', err);
            // Send an HTTP response indicating the error
            res.status(500).json({ error: 'Internal server error' });
        } else {
            // Send the query result as JSON response
            res.json(result);
        }
    });
});

messageQuery(app, connection)


// Start the Express server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
