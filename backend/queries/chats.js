
const getChatsBySenderId = (app, connection) => {
    app.get('/chatbox/chats/:senderId', (req, res) => {
        const { senderId } = req.params;
        const tableName = 'chats'
        const queryString = `
        SELECT * 
        FROM ${tableName} 
        WHERE senderId=${senderId}`;
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
    getChatsBySenderId
}