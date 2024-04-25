const bcrypt = require('bcryptjs');

const findAccount = (app, connection) => {
    app.post('/chatbox/register/check', async (req, res) => {
        try {
            const { email } = req.body;

            const queryString = `
                SELECT * FROM users WHERE email = ?
            `;

            const values = [email]

            connection.query(queryString, values, (error, results) => {
                if (error) {
                    console.error('Error executing MySQL query:', error);
                    return res.status(500).json({ error: 'Internal server error' });
                  }
              
                if (results.length === 0) {
                    return res.status(404).json({ error: 'User not found' });
                }
                  // If user is found and password matches, return user data
                res.json({ email: results[0] });
            });

        } catch (error){
            console.error('Error executing code:', error);
            res.status(500).json({ error: 'An error occurred while executing code' });
        }
    
    })
}

const createAccount = (app, connection) => {

    app.post('/chatbox/register/create', async (req, res) => {
        try {
            const { username, email, password} = req.body;

            const currentDate = new Date();
            const created_at = currentDate.toISOString().replace('T', ' ').slice(0, -5)



            const queryString = `
                INSERT INTO users (username, email, created_at, password)
                VALUES (?, ?, ?, ?)
            `;

            bcrypt.hash(password, 10, (err, hashedPassword) => {

                if (err) {
                    throw err;
                }
                const values = [username, email, created_at, hashedPassword]


                connection.query(queryString, values, (err, result) => {
                    if (err) {
                        console.error('Error saving message:', err);
                        res.status(500).json({ error: 'Error registering user' });
                    } else {
                        console.log('User was created');
                        res.status(201).json({ message: 'User created successfully' });
                    }
                });
            });

        } catch (error){
            console.error('Error saving message:', error);
            res.status(500).json({ error: 'An error occurred while saving the message' });
        }
    
    })
}

module.exports = {
    findAccount,
    createAccount
};