let MysqlPool;

module.exports = (injectedMysqlPool) => {
    MysqlPool = injectedMysqlPool;

    return {
        addAccestoken,
        getUidFromToken,
    };
};

function addAccestoken(accesToken, user, cbFunc){
    const getUserQuery = `INSERT INTO access_token (access_token, UID) VALUES ('${accesToken}', '${user}')`;
    MysqlPool.query(getUserQuery, cbFunc);
}

function getUidFromToken(token, cbFunc){
    const getUid = `SELECT * FROM old_access_tokens WHERE access_token = '${token}'`;
    MysqlPool.query(getUid, (response) => {
        const uid = 
            response.results && response.results.rowCount === 1
                ? response.results.rows[0].User_ID
                : null;
        cbFunc(uid);
    });
}
