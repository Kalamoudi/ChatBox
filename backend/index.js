const express = require('express');
const session = require('express-session');
const mysql = require('mysql');
const cors = require('cors');
const socketIo = require('socket.io');
const app = express();
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');


const messageQuery = require('./queries/messages')
const chatQuery = require('./queries/chats')
const bodyParser = require('body-parser');
const userQuery = require('./queries/users')
const loginQuery = require('./queries/login')
const registerQuery = require ('./queries/register')
const imageQuery = require("./queries/images")




const PORT = process.env.PORT || 5000;

app.use(cors({
    //origin: ['http://localhost:3000', 'http://192.168.100.42:3000'],
    origin: '*',
    credentials: true
}));

app.use(bodyParser.json());
app.use(cookieParser());


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


messageQuery.getMessagesBySenderIdAndReceiverId(app, connection)
messageQuery.getAllMessages(app, connection)
messageQuery.postMessagesBySenderIdAndReceiverId(app, connection)
chatQuery.getChatsBySenderId(app, connection)
userQuery.getAllUsers(app, connection)
userQuery.getUserById(app, connection)
userQuery.getReceiverUsersBySenderId(app, connection)
loginQuery.findUserInDb(app, connection)
registerQuery.findAccount(app, connection)
registerQuery.createAccount(app, connection)
imageQuery.getNextImageListId(app, connection)
imageQuery.postImage(app, connection)
imageQuery.postImageListEntries(app, connection)


// Start the Express server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});
