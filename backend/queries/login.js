const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');


const generateAccessToken = (user) => {
    return jwt.sign(user, 'itta7annoon', { expiresIn: '1h' }); // Adjust expiration time as needed
  };

const findUserInDb = (app, connection) => {

    app.post('/chatbox/login', async (req, res) => {
        try {
            const { email, password } = req.body;

            const queryString = `
                SELECT * FROM users WHERE email = ?
            `;

            const values = [email]

            connection.query(queryString, values, (error, result) => {
                if (error) {
                    console.error('Error executing MySQL query:', error);
                    return res.status(500).json({ error: 'Error logging in' });
                }      
                else if (result.length === 0) {
                    return res.status(401).json({ error: 'User not found or incorrect password' });
                }
                else{
                    bcrypt.compare(password, result[0].password, (err, isMatch) => {
                        if (err || !isMatch){
                            res.status(401).send('Invalid email or Password');
                        } else{
                         //   req.session.userId = result[0].user_id
                            const accessToken = generateAccessToken({ id: result[0].user_id, username: result[0].username });
                            res.cookie('accessToken', accessToken, { httpOnly: true, maxAge: 3600000, secure: false }); // Set cookie to expire in 1 hour
                           // console.log(req.session)
    
                          //  res.send('Logged in Successfully')
                          res.json({success: true, message: 'Login successful', user: result[0] });
                        }

                    });
                }
              
                  // If user is found and password matches, return user data
                  
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