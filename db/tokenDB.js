let MysqlPool;

module.exports = (injectedMysqlPool) => {
    MysqlPool = injectedMysqlPool;

    return {
        addAccestoken,
        getUidFromToken,
        isTokenValid,
        removeAccestoken,
        forceRemoveAccestoken,
    };
};
var encrypt = require('crypto');

function isTokenValid(token, cbFunc){
    var shaTok = encrypt.createHash("sha256").update(token).digest("hex");
    const query = `SELECT * FROM access_token WHERE Refresh_Token = ?`;
    const value = [shaTok];
    const checkUsrcbFunc = (response) => {
        const isValidtoken = response.results ? (response.results.length > 0) : null;
        
        cbFunc(response.error, isValidtoken);
    };
    MysqlPool.execute(query, value, checkUsrcbFunc);
}

function addAccestoken(token, user, cbFunc){
    var shaTok = encrypt.createHash("sha256").update(token).digest("hex");
    const getUserQuery = `INSERT INTO access_token (Refresh_Token, UID) VALUES (?, ?)`;
    const value = [shaTok, user];
    MysqlPool.execute(getUserQuery, value, cbFunc);
}

function removeAccestoken(token, cbFunc){
    var shaTok = encrypt.createHash("sha256").update(token).digest("hex");
    const getUserQuery = `DELETE FROM access_token WHERE Refresh_Token = ?`;
    const value = [shaTok];
    MysqlPool.execute(getUserQuery, value, cbFunc);
};

function forceRemoveAccestoken(UID, cbFunc){
    const getUserQuery = `DELETE FROM access_token WHERE UID = ?`;
    const value = [UID];
    MysqlPool.execute(getUserQuery, value, cbFunc);
};

function getUidFromToken(token, cbFunc){
    var shaTok = encrypt.createHash("sha256").update(token).digest("hex");
    const getUid = `SELECT * FROM access_tokens WHERE Refresh_Token = ?`;
    const value = [shaTok];
    MysqlPool.execute(getUid, value, (response) => {
        const uid = 
            response.results && response.results.rowCount === 1
                ? response.results.rows[0].User_ID
                : null;
        cbFunc(uid);
    });
}

