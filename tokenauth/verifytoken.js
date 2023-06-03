const jwt = require('jsonwebtoken');
const env = require('dotenv').config();

module.exports = { authenticateToken };

function authenticateToken(req, res){
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (token === null) return res.sendStatus(401);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);

        req.user = user;
        sendResponse(res, user, null);
    });
}

function sendResponse(res, message, error){
    res.status(error !== undefined ? 400 : 200).json({
        message: message,
        error: error,
    });
}