const getUserById = (app, connection) => {
    app.get('/chatbox/users/:userId', (req, res) => {
        const {userId} = req.params;
        const tableName = 'users'
        const queryString = `
        SELECT * 
        FROM ${tableName} 
        WHERE user_id=${userId}
        `
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
}

const getAllUsers = (app, connection) => {
    app.get('/chatbox/users', (req, res) => {
        const tableName = 'users'
        const queryString = `
        SELECT * 
        FROM ${tableName} `

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
}

const getReceiverUsersBySenderId = (app, connection) => {
    app.get('/chatbox/users/:senderId/receivers', (req, res) => {
        const {senderId} = req.params;
        const table1 = 'chats'
        const table2 = 'users'

        const queryString = `
        SELECT DISTINCT u.user_id, u.username
        FROM ${table1} c
        JOIN ${table2} u ON c.receiverId = u.user_id
        WHERE c.senderId = ${senderId} 
        `

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

}

module.exports = {
    getUserById,
    getAllUsers,
    getReceiverUsersBySenderId
};