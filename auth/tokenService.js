let userDB;
let tokenDB;

module.exports = (injectedUserDB, injectedTokenDB) => {
    userDB = injectedUserDB;
    tokenDB = injectedTokenDB;

    return {
        getClient,
        saveAccessToken,
        getUser,
        getAccesToken,
        grantTypeAllowed,
        getAccesToken,
    };
};

function getClient(clientID, clientSecret, cbFunc) {
    const client = {
        clientID,
        clientSecret,
        grants: null,
        redirectUris: null,
    };
    cbFunc(false, client);
}

function grantTypeAllowed(clientID, grantType, cbFunc) {
    cbFunc(false, true);
}

function getUser(username, password, cbFunc) {
    userDB.getUser(username, password, cbFunc);
}

function saveAccessToken(accessToken, clientID, expires, user, cbFunc) {
    tokenDB.addAccestoken(accessToken, user, cbFunc);
}

function getAccesToken(token, cbFunc) {
    tokenDB.getUidFromToken(token, (userID) => {
        const accesToken = {
            user: {
                id: userID,
            },
        };
        cbFunc(userID === null, userID === null ? null : accesToken );
    });
}  