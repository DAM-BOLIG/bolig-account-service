module.exports= (router, authenticator, token, permission) => {
    router.post("/register", authenticator.registerUser);
    router.post("/login", authenticator.login);
    router.post("/refreshtoken", token.checkRefreshToken);

    return router;
};