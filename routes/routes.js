module.exports= (router, authenticator, token, verifyToken, permission, testAPiService) => {
    // user registration and login
    router.post("/register", authenticator.registerUser);
    router.post("/login", authenticator.login);
    router.delete("/logout", authenticator.logout);

    router.post("/getUsernameByID", authenticator.getUsernameByID);

    //edit user
    router.put("/changeUsername", verifyToken.authenticateTokenUID ,authenticator.changeUsername);
    router.put("/changePassword", verifyToken.authenticateTokenUID ,authenticator.changePassword);
    router.put("/changeEmail", verifyToken.authenticateTokenUID ,authenticator.changeEmail);
    router.put("/changePhonenumber", verifyToken.authenticateTokenUID ,authenticator.changePhonenumber);

    // delete user
    router.delete("/deleteUser", permission.removePermissionOnlyName,authenticator.deleteUser);
    router.delete("/forceDeleteUser", verifyToken.authenticateToken, authenticator.forceLogout, permission.removePermissionOnlyName, authenticator.forceDeleteUser);

    // tokens
    router.post("/refreshtoken", token.checkRefreshToken);

    // token tests
    router.post("/verifytoken", verifyToken.authenticateToken, testAPiService.helloWorld);
    
    // permissions and roles
    router.post("/createRole", verifyToken.authenticateToken, permission.createRole);
    router.delete("/removeRole", verifyToken.authenticateToken, permission.removeRole);
    router.post("/addPermission", verifyToken.authenticateToken, permission.addPermission);
    router.delete("/removePermissionByName", verifyToken.authenticateToken, permission.removePermissionByName);
    router.get("/getRoles", verifyToken.authenticateToken, permission.getRoles);
    return router;
};