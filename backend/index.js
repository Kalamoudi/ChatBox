const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const app = express();
const messageQuery = require('./queries/messages')
const chatQuery = require('./queries/chats')
const bodyParser = require('body-parser');
const userQuery = require('./queries/users')
const loginQuery = require('./queries/login')




const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json())

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



messageQuery.getMessagesBySenderIdAndReceiverId(app, connection)
messageQuery.getAllMessages(app, connection)
messageQuery.postMessagesBySenderIdAndReceiverId(app, connection)
chatQuery.getChatsBySenderId(app, connection)
userQuery.getAllUsers(app, connection)
userQuery.getUserById(app, connection)
userQuery.getReceiverUsersBySenderId(app, connection)
loginQuery.findUserInDb(app, connection)


// Start the Express server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
