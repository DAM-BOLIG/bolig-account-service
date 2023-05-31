module.exports= (router, authenticator, permission) => {
    router.post("/register", authenticator.registerUser);
    router.post("/login", authenticator.login);

    return router;
};