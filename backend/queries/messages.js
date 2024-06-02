const getMessagesBySenderIdAndReceiverId = (app, connection) => {
    app.get('/chatbox/messages/:senderId/:receiverId', (req, res) => {
        const { senderId, receiverId } = req.params;
        const tableName = 'messages'
        const queryString = `
        SELECT * 
        FROM ${tableName} 
        WHERE (senderId=${senderId} AND receiverId=${receiverId}) OR (senderId=${receiverId} AND receiverId=${senderId})
        ORDER BY date ASC
        `;
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

const getAllMessages = (app, connection) => {
    app.get('/chatbox/messages/', (req, res) => {
        const { senderId, receiverId } = req.params;
        const tableName = 'messages'
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

const postMessagesBySenderIdAndReceiverId = (app, connection) => {

    app.post('/chatbox/messages', async (req, res) => {
        try {
            //const { senderId, receiverId, content, date } = req.body;
            const {senderId, receiverId, content, date, ImageListId} = req.body

            const queryString = `
                INSERT INTO messages (senderId, receiverId, content, date, ImageListId)
                VALUES (?, ?, ?, ?, ?)
            `;

            const values = [senderId, receiverId, content, date, ImageListId]

            connection.query(queryString, values, (err, result) => {
                if (err) {
                    console.error('Error saving message:', err);
                    res.status(500).json({ error: 'An error occurred while saving the message' });
                } else {
                  //  console.log('Message saved successfully');
                    res.status(201).json({ message: 'Message saved successfully' });
                }
            });

        } catch (error){
            console.error('Error saving message:', error);
            res.status(500).json({ error: 'An error occurred while saving the message' });
        }
    
    })

}

const getMessageImagesByIds = (app, connection) => {
    app.post('/chatbox/messages/:senderId/:receiverId/idList', (req, res) => {
        const {idList} = req.body;

        console.log("IDS:")
        console.log(idList)
        const tableName = 'images'
        const placeholders = idList.map((id) => id).join(',')
        const queryString = `
        SELECT * 
        FROM ${tableName} 
        WHERE ImageListId IN (${placeholders})
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


const getLastMessageBySenderId = (app, connection) => {
    app.get('/chatbox/lastMessages/:senderId', (req, res) => {
        const { senderId } = req.params;
        const tableName = 'messages'
        const queryString = `
        SELECT m.*
        FROM ${tableName} m
        INNER JOIN (
            SELECT receiverId, MAX(id) AS max_id
            FROM ${tableName}
            WHERE senderId = ${senderId}
            GROUP BY receiverId
        ) AS subquery ON m.id = subquery.max_id;
        
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
    getMessagesBySenderIdAndReceiverId,
    getAllMessages,
    postMessagesBySenderIdAndReceiverId,
    getMessageImagesByIds,
    getLastMessageBySenderId,
};