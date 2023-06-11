let MysqlPool;

module.exports = (injectedMysqlPool) => {
    MysqlPool = injectedMysqlPool;

    return {
        addAccestoken,
        getUidFromToken,
        isTokenValid,
        removeAccestoken,
    };
};

function isTokenValid(token, cbFunc){
    const query = `SELECT * FROM access_token WHERE Access_Token = '${token}'`;
    const checkUsrcbFunc = (response) => {
        const isValidtoken = response.results ? (response.results.length > 0) : null;
        
        cbFunc(response.error, isValidtoken);
    };
    MysqlPool.query(query, checkUsrcbFunc);
}

function addAccestoken(accesToken, user, cbFunc){
    const getUserQuery = `INSERT INTO access_token (Access_Token, UID) VALUES ('${accesToken}', '${user}')`;
    MysqlPool.query(getUserQuery, cbFunc);
}

function removeAccestoken(accesToken, cbFunc){
    const getUserQuery = `DELETE FROM access_token WHERE Access_Token = '${accesToken}'`;
    MysqlPool.query(getUserQuery, cbFunc);
};

function getUidFromToken(token, cbFunc){
    const getUid = `SELECT * FROM access_tokens WHERE Access_Token = '${token}'`;
    MysqlPool.query(getUid, (response) => {
        const uid = 
            response.results && response.results.rowCount === 1
                ? response.results.rows[0].User_ID
                : null;
        cbFunc(uid);
    });
}

