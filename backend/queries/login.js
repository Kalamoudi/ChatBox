
const findUserInDb = (app, connection) => {

    app.post('/chatbox/login', async (req, res) => {
        try {
            const { email, password } = req.body;

            const queryString = `
                SELECT * FROM users WHERE email = ? AND password = ?
            `;

            const values = [email, password,]

            connection.query(queryString, values, (error, results) => {
                if (error) {
                    console.error('Error executing MySQL query:', error);
                    return res.status(500).json({ error: 'Internal server error' });
                  }
              
                  if (results.length === 0) {
                    return res.status(404).json({ error: 'User not found or incorrect password' });
                  }
              
                  // If user is found and password matches, return user data
                  res.json({ user: results[0] });
            });

        } catch (error){
            console.error('Error executing code:', error);
            res.status(500).json({ error: 'An error occurred while executing code' });
        }
    
    })
}

module.exports = {
    findUserInDb
};