let userDB
let tokenDB
const { is } = require('express/lib/request');
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

        getUsernameByID,

        changeUsername,
        changePassword,
        changeEmail,
        changePhonenumber,

        deleteUser,
        forceDeleteUser,
    }
};


// user registration function
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


// user login and logout functions
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
            res.json({accessToken: accessToken, refreshToken: refreshToken, username: req.body.name});
        });
    });
};

function logout(req, res){
    const refreshToken = req.body.token;
    tokenDB.removeAccestoken(refreshToken, (response) => {
        sendResponse(res, response.error === null ? "Succes!!" : "something, went wrong", response.error);
    });
};

function getUsernameByID(req, res){
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (token === null) return res.sendStatus(401);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        userDB.getUsersNameByuid(user.UID, (response) => {
            sendResponse(res, response.results[0].Name, response.error);
        });
        //sendResponse(res, user, null);
    });
};


// db functions to change user information
function changeUsername(req, res){
    userDB.isUserValid(req.body.name, req.body.password, (error, isUserValid) => {
        if (error || !isUserValid){
            const message = error 
                ? "something went wrong" 
                : 'wrong username or password';
            sendResponse(res, message, error);
            return;
        } 

        userDB.isValidUser(req.body.newname, (error, isValidUser) => {
            if (error || !isValidUser){
                const message = error 
                    ? "something went wrong" 
                    : 'name already in use already exists';
                sendResponse(res, message, error);
                return;
            }

            userDB.changeUsername(req.body.UID, req.body.newname, (response) => {
                sendResponse(res, response.error === null ? "Succes!!" : "something, went wrong", response.error);
            });
        });

    });
}

function changePassword(req, res){
    userDB.isUserValid(req.body.name, req.body.password, (error, isUserValid) => {
        if (error || !isUserValid){
            const message = error 
                ? "something went wrong" 
                : 'wrong username or password';
            sendResponse(res, message, error);
            return;
        }
        userDB.changePassword(req.body.UID, req.body.newpassword, (response) => {
            sendResponse(res, response.error === null ? "Succes!!" : "something, went wrong", response.error);
        });
    });
};

function changeEmail(req, res){
    userDB.isUserValid(req.body.name, req.body.password, (error, isUserValid) => {
        if (error || !isUserValid){
            const message = error 
                ? "something went wrong" 
                : 'wrong username or password';
            sendResponse(res, message, error);
            return;
        }
        userDB.changeEmail(req.body.UID, req.body.newemail, (response) => {
            sendResponse(res, response.error === null ? "Succes!!" : "something, went wrong", response.error);
        });
    });
}

function changePhonenumber(req, res){
    userDB.isUserValid(req.body.name, req.body.password, (error, isUserValid) => {
        if (error || !isUserValid){
            const message = error 
                ? "something went wrong" 
                : 'wrong username or password';
            sendResponse(res, message, error);
            return;
        }
        userDB.changePhonenumber(req.body.UID, req.body.newphonenumber, (response) => {
            sendResponse(res, response.error === null ? "Succes!!" : "something, went wrong", response.error);
        });
    });
}

// delete user functions
function deleteUser(req, res){
    userDB.isUserValid(req.body.name, req.body.password, (error, isUserValid) => {
        if (error || !isUserValid){
            const message = error 
                ? "something went wrong" 
                : 'wrong username or password';
            sendResponse(res, message, error);
            return;
        }
        userDB.deleteUser(req.body.name, req.body.password, (response) => {
            sendResponse(res, response.error === null ? "Succes!!" : "something, went wrong", response.error);
        });
    });
}

function forceDeleteUser(req, res){
    userDB.forceDeleteUser(req.body.name, (response) => {
        sendResponse(res, response.error === null ? "Succes!!" : "something, went wrong", response.error);
    });
}

// login token functions
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


// response functions
function sendResponse(res, message, error){
    res.status(error !== undefined ? 400 : 200).json({
        message: message,
        error: error,
    });
}