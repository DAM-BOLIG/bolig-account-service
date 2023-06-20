//const { response } = require("express");
let Mysqlpool;

module.exports = (injectedMysqlPool) => {
    Mysqlpool = injectedMysqlPool;

    return {
        register,
        getUser,
        getUsersNameByuid,
        userLookup,
        getUIDNameByName,

        changeUsername,
        changePassword,
        changeEmail,
        changePhonenumber,

        deleteUser,
        forceDeleteUser,
        
        isUserValid,
        isValidUser,
    };
};

var encrypt = require('crypto');
const { is } = require('express/lib/request');

function register(name, password, email, phonenumber, cbFunc){
    var shaPass = encrypt.createHash("sha256").update(password).digest("hex");
    const query = `INSERT INTO users (Name, User_Password, Email, Phonenumber) VALUES (?, ?, ?, ?)`;
    const value = [name, shaPass, email, phonenumber];
    Mysqlpool.execute(query, value, cbFunc);
}

function getUser(name, password, cbFunc){
    var shaPass = encrypt.createHash("sha256").update(password).digest("hex");
    const getUserQuery = `CALL getUserRole(?,?)`;
    const value = [name, shaPass];
    Mysqlpool.execute(getUserQuery, value, cbFunc);
}


// db functions to change user information
function changeUsername(UID, name, cbFunc){
    const query = `UPDATE users SET Name = ? WHERE UID = ?`;
    const value = [name, UID];
    Mysqlpool.execute(query, value, cbFunc);
}

function changePassword(UID, password, cbFunc){
    var shaPass = encrypt.createHash("sha256").update(password).digest("hex");
    const query = `UPDATE users SET User_Password = ? WHERE UID = ?`;
    const value = [shaPass, UID];
    Mysqlpool.execute(query, value, cbFunc);
}

function changeEmail(UID, email, cbFunc){
    const query = `UPDATE users SET Email = ? WHERE UID = ?`;
    const value = [email, UID];
    Mysqlpool.execute(query, value, cbFunc);
}

function changePhonenumber(UID, phonenumber, cbFunc){
    const query = `UPDATE users SET Phonenumber = ? WHERE UID = ?`;
    const value = [phonenumber, UID];
    Mysqlpool.execute(query, value, cbFunc);
}


// delete user
function deleteUser(name, password, cbFunc){
    var shaPass = encrypt.createHash("sha256").update(password).digest("hex");
    const query = `DELETE FROM users WHERE Name = ? AND User_Password = ?`;
    const value = [name, shaPass];
    Mysqlpool.execute(query, value, cbFunc);
}

function forceDeleteUser(name, cbFunc){
    const query = `DELETE FROM users WHERE Name = ?`;
    const value = [name];
    Mysqlpool.execute(query, value, cbFunc);
}


// checks if user has correct login information
function isUserValid(name, password, cbFunc){
    var shaPass = encrypt.createHash("sha256").update(password).digest("hex");
    const query = `SELECT * FROM users WHERE Name = ? AND User_Password = ?`;
    const value = [name, shaPass];
    const validateUsrcbFunc = (response) => {
        const isUserValid = response.results ? !(response.results.length === 0) : null;
        
        cbFunc(response.error, isUserValid);
    };
    Mysqlpool.execute(query, value, validateUsrcbFunc);
}

function getUsersNameByuid(UID, cbFunc){
    const query = `SELECT Name FROM users WHERE UID = ? `;
    const value = [UID];
    Mysqlpool.execute(query, value, cbFunc);
};

function getUIDNameByName(name, cbFunc){
    const query = `SELECT UID FROM users WHERE Name = ? `;
    const value = [name];
    Mysqlpool.execute(query, value, cbFunc);
};

function userLookup(name, cbFunc){

};

// checks if username is already in use
function isValidUser(name, cbFunc){
    const query = `CALL isValidUser(?) `;
    const value = [name];
    const checkUsrcbFunc = (response) => {
        const isValidUser = response.results ? !(response.results[0].length > 0) : null;
        
        cbFunc(response.error, isValidUser);
    };
    Mysqlpool.execute(query, value, checkUsrcbFunc);
}