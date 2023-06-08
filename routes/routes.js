module.exports= (router, authenticator, token, verifyToken, permission, testAPiService) => {
    router.post("/register", authenticator.registerUser);
    router.post("/login", authenticator.login);
    router.post("/refreshtoken", token.checkRefreshToken);
    router.post("/verifytoken", verifyToken.authenticateToken, testAPiService.helloWorld);
    router.post("/createRole", permission.createRole);
    router.post("/addPermission", permission.addPermission);
    router.post("/removePermission", permission.removePermission);

    return router;
};