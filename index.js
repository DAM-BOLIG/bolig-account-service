// import for Database
 const MysqlPool = require('./db/dbWrapper.js');
 const tokenDB = require('./db/tokenDB.js')(MysqlPool);
 const userDB = require('./db/userDB.js')(MysqlPool);
 const permissionDB = require('./db/permissionDB.js')(MysqlPool);

//Express
const express = require('express');
const app = express();


// Test
const testAPiService = require('./test/testAPIService.js');


// Auth and Api routes
const authenticator = require('./auth/authenticator.js')(userDB, tokenDB);
const token = require('./auth/tokens.js')(userDB, tokenDB);
const permission = require('./auth/permission.js')(tokenDB, userDB, permissionDB);
const verifyToken = require('./tokenauth/verifytoken.js');
const routes = require('./routes/routes.js')(
    express.Router(),
    authenticator,
    token,
    verifyToken,
    permission,
    testAPiService
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