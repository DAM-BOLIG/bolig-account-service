const mysql = require('mysql2');
const env = require('dotenv').config();


function query(queryString, cbFunc) {
    const connection = mysql.createPool({
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE,
    });
    connection.query(queryString, (error,result) => {
        cbFunc(setResponse(error, result));
    });
}

function setResponse(error, result) {
    return {
        error: error,
        result: result ? result : null,
    };
}

module.exports = {
    query,
};