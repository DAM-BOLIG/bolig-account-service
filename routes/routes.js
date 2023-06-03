module.exports= (router, authenticator, token, verifyToken, permission) => {
    router.post("/register", authenticator.registerUser);
    router.post("/login", authenticator.login);
    router.post("/refreshtoken", token.checkRefreshToken);
    router.post("/verifytoken", verifyToken.authenticateToken);

    return router;
};