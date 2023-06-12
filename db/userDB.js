//const { response } = require("express");
let Mysqlpool;

module.exports = (injectedMysqlPool) => {
    Mysqlpool = injectedMysqlPool;

    return {
        register,
        getUser,
        getusers,
        userLookup,
        changeUsername,
        changePassword,
        changeEmail,
        changePhonenumber,
        isUserValid,
        isValidUser,
    };
};

var encrypt = require('crypto');
const { is } = require('express/lib/request');

function register(name, password, email, phonenumber, cbFunc){
    var shaPass = encrypt.createHash("sha256").update(password).digest("hex");
    const query = `INSERT INTO users (Name, User_Password, Email, Phonenumber) VALUES ('${name}', '${shaPass}', '${email}', '${phonenumber}')`;
    Mysqlpool.query(query, cbFunc);
}

function getUser(name, password, cbFunc){
    var shaPass = encrypt.createHash("sha256").update(password).digest("hex");
    const getUserQuery = `CALL getUserRole('${name}','${shaPass}')`;
    Mysqlpool.query(getUserQuery, cbFunc);
}


// db functions to change user information
function changeUsername(UID, name, cbFunc){
    const query = `UPDATE users SET Name = '${name}' WHERE UID = '${UID}'`;
    Mysqlpool.query(query, cbFunc);
}

function changePassword(UID, password, cbFunc){
    var shaPass = encrypt.createHash("sha256").update(password).digest("hex");
    const query = `UPDATE users SET User_Password = '${shaPass}' WHERE UID = '${UID}'`;
    Mysqlpool.query(query, cbFunc);
}

function changeEmail(UID, email, cbFunc){
    const query = `UPDATE users SET Email = '${email}' WHERE UID = '${UID}'`;
    Mysqlpool.query(query, cbFunc);
}

function changePhonenumber(UID, phonenumber, cbFunc){
    const query = `UPDATE users SET Phonenumber = '${phonenumber}' WHERE UID = '${UID}'`;
    Mysqlpool.query(query, cbFunc);
}


// checks if user has correct login information
function isUserValid(name, password, cbFunc){
    var shaPass = encrypt.createHash("sha256").update(password).digest("hex");
    const query = `SELECT * FROM users WHERE Name = '${name}' AND User_Password = '${shaPass}'`;
    const validateUsrcbFunc = (response) => {
        const isUserValid = response.results ? !(response.results[0].length > 0) : null;
        
        cbFunc(response.error, isUserValid);
    };
    Mysqlpool.query(query, validateUsrcbFunc);
}

function getusers(cbFunc){

};

function userLookup(name, cbFunc){

};

// checks if username is already in use
function isValidUser(name, cbFunc){
    const query = `CALL isValidUser("${name}") `;
    const checkUsrcbFunc = (response) => {
        const isValidUser = response.results ? !(response.results[0].length > 0) : null;
        
        cbFunc(response.error, isValidUser);
    };
    Mysqlpool.query(query, checkUsrcbFunc);
}