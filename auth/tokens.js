let userDB;
let tokenDB;
const jwt = require('jsonwebtoken');
const env = require('dotenv').config();

module.exports = (injectedUserDB, injectedTokenDB) => {
    userDB = injectedUserDB;
    tokenDB = injectedTokenDB;

    return {
        checkRefreshToken,
    };
}


function checkRefreshToken(req, res){
    tokenDB.isTokenValid(req.body.token, (error, isValidToken) => {
        if(error || !isValidToken){
            const message = error
                ? "something went wrong"
                : "Invalid refresh token";
            sendResponse(res, message, error);
            return;
        }
        jwt.verify(req.body.token, process.env.REFRESH_TOKEN_SECRET, (err, userInfo) => {
            if(err){
                sendResponse(res, "Invalid refresh token", err);
                return;
            }
            let user = {UID: userInfo.UID, BrandName: userInfo.BrandName};
            const accessToken = generateAccessToken(user);
            res.json({accessToken: accessToken});
        });
    });
};

function generateAccessToken(user){
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '15m'});
}

function sendResponse(res, message, error){
    res.status(error !== undefined ? 400 : 200).json({
        message: message,
        error: error,
    });
}
