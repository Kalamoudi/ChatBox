

const getNextProfilePictureId = (app, connection) => {
    app.get('/chatbox/profilePicture/nextId', (req, res) => {
        const tablename = 'profile_picture'
        const queryString = `
        SELECT MAX(ID) AS ID FROM ${tablename}
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

const addProfilePicture = (app, connection) => {

    app.post('/chatbox/profilePicture/add', async (req, res) => {
        try {
            const {profilePicturePath} = req.body

            const pathToImages = "C:\\Users\\Khalid\\Documents\\Workspaces-VSC\\SelfProjects\\images_for_simple-react-app\\" + profilePicturePath

            console.log(profilePicturePath)

            const tablename = 'profile_picture'
            const queryString = `
                INSERT INTO ${tablename} (ProfilePicture)
                VALUES (?)
            `;

            const values = [profilePicturePath]

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

const deleteProfilePicture = (app, connection) => {

    app.post('/chatbox/profilePicture/:ID/delete', async (req, res) => {
        try {
            const {currentPictureId} = req.body

           // console.log("CURRENT PICTURE ID: " + currentPictureId)

            const tablename = 'profile_picture'
            const queryString = `
                DELETE FROM ${tablename}
                WHERE ID=${currentPictureId}
            `;

            connection.query(queryString, (err, result) => {
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

const updateUserProfilePicture = (app, connection) => {
    app.post('/chatbox/users/:senderId/update', async (req, res) => {
        try {
            //const { senderId, receiverId, content, date } = req.body;
            const { user_id, nextPictureId} = req.body

            const userTable = 'users'
            const queryString = `
                UPDATE ${userTable}
                SET ProfilePictureId = ${nextPictureId}
                WHERE user_id = ${user_id}
            `;

            connection.query(queryString, (err, result) => {
                if (err) {
                    console.error('Error updating users:', err);
                    res.status(500).json({ error: 'An error occurred while updating the Profile Picture Id' });
                } else {
                  //  console.log('Message saved successfully');
                    res.status(201).json({ message: 'Profile Picture update successful' });
                }
            });

        } catch (error){
            console.error('Error updating users:', error);
            res.status(500).json({ error: 'An error occurred while updating the Profile Picture Id' });
        }

    })
}


const getRecevierPicsByIds = (app, connection) => {
    app.post('/chatbox/profilePicture/:userId/idList', (req, res) => {
        const {idList} = req.body;

        console.log("PEWPEW")
        console.log(idList)
        const tableName = 'profile_picture'
        const placeholders = idList.map((id) => id).join(',')
        const queryString = `
        SELECT * 
        FROM ${tableName} 
        WHERE ID IN (${placeholders})
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

const getProfilePictureById = (app, connection) => {
    app.post('/chatbox/profilePicture/:id', (req, res) => {
        const {id} = req.params;
        console.log(id)

        const tableName = 'profile_picture'
        const queryString = `
        SELECT * 
        FROM ${tableName} 
        WHERE ID=${id}
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
    getNextProfilePictureId,
    addProfilePicture,
    deleteProfilePicture,
    updateUserProfilePicture,
    getProfilePictureById,
    getRecevierPicsByIds
};