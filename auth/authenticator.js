let userDB
let tokenDB
const jwt = require('jsonwebtoken');
const env = require('dotenv').config();


module.exports = (injectedUserDB, injectedTokenDB) => {
    userDB = injectedUserDB;
    tokenDB = injectedTokenDB;

    return {
        registerUser,
        login,
    }
};

function registerUser(req, res){
    userDB.isValidUser(req.body.name, (error, isValidUser) => {
        if (error || !isValidUser){
            const message = error 
                ? "something went wrong" 
                : 'name already in use already exists';
            sendResponse(res, message, error);
            return;
        } 
    
        userDB.register(req.body.name, req.body.password, req.body.email, req.body.phonenumber, (response) => {
            sendResponse(res, response.error === null ? "Succes!!" : "something, went wrong", response.error);
        });
    });
}

function login(req, res){
    userDB.getUser(req.body.name, req.body.password, (response) => {
        if (response.error !== null){
            sendResponse(res, "something went wrong", response.error);
            return;
        }
        else if (response.results.length === 0){
            sendResponse(res, "wrong Username or Password", response.error);
        }

        const responseUser = response.results;
        let user = []
        for (let i = 0; i < responseUser; i++){
            user.push({
                uid: responseUser[i].UID,
                brand: responseUser[i].BrandName,
            });
        }; 

        const accessToken = generateaccestoken(user);
        const refreshToken = jwt.sign({user}, process.env.REFRESH_TOKEN_SECRET);
        tokenDB.addAccestoken(refreshToken, response.results[0].UID, (response) => {
            if (response.error !== null){
                sendResponse(res, "something went wrong", response.error);
                return;
            }
            res.json({accessToken: accessToken, refreshToken: refreshToken});
        });
    });
};

function generateaccestoken(user){
    return jwt.sign({user}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '15m'});
}

function sendResponse(res, message, error){
    res.status(error !== undefined ? 400 : 200).json({
        message: message,
        error: error,
    });
}