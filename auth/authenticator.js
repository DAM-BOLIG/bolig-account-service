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
        authenticateToken,
        logout,
        changeUsername,
        changePassword,
        changeEmail,
        changePhonenumber,
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
        else if (response.results[0].length === 0){
            sendResponse(res, "wrong Username or Password", response.error);
            return;
        }

        const responseUser = response.results[0];
        let user = {UID: responseUser[0].UID, Role: responseUser[0].Role};
        /*
        for (let i = 0; i < responseUser; i++){
            user.push({
                uid: responseUser[i].UID,
                brand: responseUser[i].BrandName,
            });
        }; 
        */
        const accessToken = generateaccestoken(user);
        const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
        tokenDB.addAccestoken(refreshToken, responseUser[0].UID, (response) => {
            if (response.error !== null){
                sendResponse(res, "something went wrong", response.error);
                return;
            }
            res.json({accessToken: accessToken, refreshToken: refreshToken});
        });
    });
};

function logout(req, res){
    const refreshToken = req.body.token;
    tokenDB.removeAccestoken(refreshToken, (response) => {
        sendResponse(res, response.error === null ? "Succes!!" : "something, went wrong", response.error);
    });
};

function changeUsername(req, res){

}

function changePassword(req, res){

};

function changeEmail(req, res){

}

function changePhonenumber(req, res){

}

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

function generateaccestoken(user){
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '1d'});
}

function sendResponse(res, message, error){
    res.status(error !== undefined ? 400 : 200).json({
        message: message,
        error: error,
    });
}