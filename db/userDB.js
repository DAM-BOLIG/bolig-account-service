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
    const query = `INSERT INTO users (Name, User_Password, Email, Phonenumber) VALUES ('${name}', '${shaPass}', '${email}', '${phonenumber}')`;
    Mysqlpool.query(query, cbFunc);
}

function getUser(name, password, cbFunc){
    var shaPass = encrypt.createHash("sha256").update(password).digest("hex");
    getUserQuery = `CALL getUserRole('${name}','${shaPass}')`;
    Mysqlpool.query(getUserQuery, cbFunc);
}

function isValidUser(name, cbFunc){
    const query = `CALL isValidUser("${name}") `;
    const checkUsrcbFunc = (response) => {
        const isValidUser = response.results ? !(response.results[0].length > 0) : null;
        
        cbFunc(response.error, isValidUser);
    };
    Mysqlpool.query(query, checkUsrcbFunc);
}