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
    getUserQuery = `CALL getUserRole('${name}','${shaPass}')`;
    Mysqlpool.query(getUserQuery, cbFunc);
}

function changeUsername(UID, name, cbFunc){

}

function changePassword(UID, password, cbFunc){

}

function changeEmail(UID, email, cbFunc){

}

function changePhonenumber(UID, phonenumber, cbFunc){

}

function isUserValid(name, password, cbFunc){
    const query = `SELECT * FROM users WHERE Name = '${name}' AND User_Password = '${password}'`;
    Mysqlpool.query(query, cbFunc);
}

function getusers(cbFunc){

};

function userLookup(name, cbFunc){

};


function isValidUser(name, cbFunc){
    const query = `CALL isValidUser("${name}") `;
    const checkUsrcbFunc = (response) => {
        const isValidUser = response.results ? !(response.results[0].length > 0) : null;
        
        cbFunc(response.error, isValidUser);
    };
    Mysqlpool.query(query, checkUsrcbFunc);
}