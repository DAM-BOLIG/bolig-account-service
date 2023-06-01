// import for Database
 const MysqlPool = require('./db/dbWrapper.js');
 const tokenDB = require('./db/tokenDB.js')(MysqlPool);
 const userDB = require('./db/userDB.js')(MysqlPool);
 const permissionDB = require('./db/permissionDB.js')(MysqlPool);



// imports for OAuth2.0 
/*
const oAuthService = require('./auth/tokenService.js')(userDB, tokenDB);
const OAuth2Server = require('node-oauth2-server');
*/

//Express
const express = require('express');
const app = express();
/*
app.oauth = OAuth2Server({
    model: oAuthService,
    grants: ['password'],
    debug: true,
});
*/



// Test
/*const testAPiService = require('./test/testAPIService.js');
const testAPIRoutes = require('./test/testAPIRoutes.js')(
    express.Router(),
    app,
    testAPiService
);
*/

// Auth and Api routes
const authenticator = require('./auth/authenticator.js')(userDB, tokenDB);
const token = require('./auth/tokens.js')(userDB, tokenDB);
const permission = require('./auth/permission.js')(tokenDB, permissionDB);
const verifyToken = require('./tokenauth/verifytoken.js');
const routes = require('./routes/routes.js')(
    express.Router(),
    authenticator,
    token,
    verifyToken,
    permission
);


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//app.use(app.oauth.errorHandler());
app.use('/auth', routes);
//app.use('/api', testAPIRoutes);

const port = 3000;
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});