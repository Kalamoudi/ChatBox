


const getNextImageListId = (app, connection) => {
    app.get('/chatbox/imageList', (req, res) => {
        const table1 = 'image_lists'
        const table2 = 'messages'
        const queryString = `
        SELECT MAX(ImageListId) AS Ids FROM ${table1}
        UNION
        SELECT MAX(ID) FROM ${table2}
        `
        // Execute the query
        connection.query(queryString, (err, result) => {
            if (err) {
                console.error('Error executing query:', err);
                // Send an HTTP response indicating the error
                res.status(500).json({ error: 'Internal server error' });
            } else {
                // Send the query result as JSON response
                res.status(200).json(result);
            }
        });
    });
}


const postImageListEntries = (app, connection) => {
    app.post('/chatbox/imageList', async (req, res) => {
        try{

            const {ImageListId, MessageId} = req.body

            const tablename = 'image_lists'
            const queryString = `
                INSERT INTO ${tablename} (ImageListId, MessageId)
                VALUES (?, ?)
            
            `;
            const values = [ImageListId, MessageId]

            connection.query(queryString, values, (err, result) => {
                if (err) {
                    console.error('Error saving imageList', err);
                    res.status(500).json({ error: 'An error occurred while saving the imageList' });
                } else {
                  //  console.log('Message saved successfully');
                    res.status(201).json({ message: 'Image saved successfully' });
                }
            });
        }catch(error){
            console.error('Error saving imageList:', error);
            res.status(500).json({ error: 'An error occurred while saving the imageList' });
        }
    })



}

const postImage = (app, connection) => {

    app.post('/chatbox/images', async (req, res) => {
        try {
            const {ImageData, ImageListId, Height, Width} = req.body

            const tablename = 'images'
            const queryString = `
                INSERT INTO ${tablename} (ImageData, ImageListId, Height, Width)
                VALUES (?, ?, ?, ?)
            `;

            const values = [ImageData, ImageListId, Height, Width]

            connection.query(queryString, values, (err, result) => {
                if (err) {
                    console.error('Error saving images', err);
                    res.status(500).json({ error: 'An error occurred while saving the image' });
                } else {
                  //  console.log('Message saved successfully');
                    res.status(201).json({ message: 'Image saved successfully' });
                }
            });

        } catch (error){
            console.error('Error saving image:', error);
            res.status(500).json({ error: 'An error occurred while saving the image' });
        }
    
    })
}

module.exports = {
    getNextImageListId,
    postImage,
    postImageListEntries
}