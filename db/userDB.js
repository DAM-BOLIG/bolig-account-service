//const { response } = require("express");

let Mysqlpool;

module.exports = (injectedMysqlPool) => {
    Mysqlpool = injectedMysqlPool;

    return {
        register,
        getUser,
        isValidUser,
    };
};

var encrypt = require('crypto');

function register(name, password, email, phonenumber, cbFunc){
    var shaPass = encrypt.createHash("sha256").update(password).digest("hex");
    const query = `INSERT INTO users (Name, User_Password, Email, PhoneNumber) VALUES ('${name}', '${shaPass}', '${email}', '${phonenumber}')`;
    Mysqlpool.query(query, cbFunc);
}

function getUser(name, password, cbFunc){
    var shaPass = encrypt.createHash("sha256").update(password).digest("hex");
    getUserQuery = `SELECT * FROM users WHERE Name = '${name}' AND User_Password = '${shaPass}'`;
    Mysqlpool.query(getUserQuery, response => {
        cbFunc(
            false,
            response.results && response.results.length === 1
                ? response.results[0]
                : null
            );
    });
}

function isValidUser(name, cbFunc){
    const query = `SELECT * FROM users WHERE Name = '${name}'`;
    const checkUsrcbFunc = (response) => {
        const isValidUser = response.results ? !(response.results.length > 0) : null;
        
        cbFunc(response.error, isValidUser);
    };
    Mysqlpool.query(query, checkUsrcbFunc);
}