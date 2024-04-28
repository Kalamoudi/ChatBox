


const getCookie = () => {
    app.get('/set-cookie', (req, res) => {
        res.cookie('myCookie', 'cookieValue', { maxAge: 900000, httpOnly: true });
        res.send('Cookie has been set');
      });
      
} 



module.exports = {
    getCookie
}