const checkSessionMiddleware = (req, res, next) => {
    if (!req.session.userId) {
        // Session does not exist
        return res.status(401).json({ session: false });
    }
    next();
};

// Endpoint to check session status
// const sessionAPI = (app) => {
//     app.get('/chatbox/session', checkSessionMiddleware, (req, res) => {
//        // res.status(200).send('Session exists');
//         const userId = req.session.userId
//         console.log(userId)
//         res.status(200).json({ userId: userId, session: true });
//     });
// }

const sessionAPI = (app) => {
    // Remove the route prefix '/chatbox/session' from here
    app.get('/chatbox/session', checkSessionMiddleware, (req, res) => {
        const userId = req.session.userId;
        console.log(userId);
        res.status(200).json({ userId: userId, session: true });
    });
  
}

module.exports = {
    sessionAPI
};