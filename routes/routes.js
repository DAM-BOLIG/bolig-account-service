module.exports= (router, authenticator, token, verifyToken, permission, testAPiService) => {
    // user registration and login
    router.post("/register", authenticator.registerUser);
    router.post("/login", authenticator.login);
    router.post("/logout", authenticator.logout);

    // tokens
    router.post("/refreshtoken", token.checkRefreshToken);

    // token tests
    router.post("/verifytoken", verifyToken.authenticateToken, testAPiService.helloWorld);
    
    // permissions and roles
    router.post("/createRole", permission.createRole);
    router.post("/addPermission", permission.addPermission);
    router.post("/removePermissionByName", permission.removePermissionByName);

    return router;
};