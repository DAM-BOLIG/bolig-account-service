module.exports= (router, authenticator, token, verifyToken, permission, testAPiService) => {
    // user registration and login
    router.post("/register", authenticator.registerUser);
    router.post("/login", authenticator.login);
    router.post("/logout", authenticator.logout);

    router.post("/getUsernameByID", authenticator.getUsernameByID);

    //edit user
    router.post("/changeUsername", authenticator.changeUsername);
    router.post("/changePassword", authenticator.changePassword);
    router.post("/changeEmail", authenticator.changeEmail);
    router.post("/changePhonenumber", authenticator.changePhonenumber);

    // delete user
    router.post("/deleteUser", permission.removePermissionOnlyName,authenticator.deleteUser);
    router.post("/forceDeleteUser", verifyToken.authenticateToken, permission.removePermissionOnlyName, authenticator.forceDeleteUser);

    // tokens
    router.post("/refreshtoken", token.checkRefreshToken);

    // token tests
    router.post("/verifytoken", verifyToken.authenticateToken, testAPiService.helloWorld);
    
    // permissions and roles
    router.post("/createRole", verifyToken.authenticateToken, permission.createRole);
    router.post("/removeRole", verifyToken.authenticateToken, permission.removeRole);
    router.post("/addPermission", verifyToken.authenticateToken, permission.addPermission);
    router.post("/removePermissionByName", verifyToken.authenticateToken, permission.removePermissionByName);

    return router;
};