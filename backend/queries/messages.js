

const getMessagesBySenderIdAndReceiverId = (app, connection) => {
    app.get('/chatbox/messages/:senderId/:receiverId', (req, res) => {
        const { senderId, receiverId } = req.params;
        const tableName = 'messages'
        const queryString = `
        SELECT * 
        FROM ${tableName} 
        WHERE (senderId=${senderId} AND receiverId=${receiverId})`;
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

module.exports = getMessagesBySenderIdAndReceiverId;