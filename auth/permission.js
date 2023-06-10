const { response } = require("express");

let tokenDB;
let roleDB;
let permissionDB;

module.exports = (injectedTokenDB,  injectedRoleDB, injectedPermissionDB) => {
    tokenDB = injectedTokenDB;
    roleDB = injectedRoleDB;
    permissionDB = injectedPermissionDB;

    return {
        createRole,
        addPermission,
        removePermission,
    };
}

function createRole(req, res){
    permissionDB.isRoleValid(req.body.Role, (error, isValidRole) => {
        if (error || !isValidRole){
            const message = error 
                ? "something went wrong" 
                : 'Role already exists';
            sendResponse(res, message, error);
            return;
        } 
    
        permissionDB.addRole(req.body.Role, (response) => {
            sendResponse(res, response.error === null ? "Succes!!" : "something, went wrong", response.error);
        });
    });
};

function addPermission(req,res){
    permissionDB.findRoleID(req.body.Role, (response) => {
        const roleID = response.results[0].RoleID;
        permissionDB.findUserID(req.body.Name, (response) => {
            const userID = response.results[0].UID;
            permissionDB.addPermission(userID, roleID, (response) => {
                sendResponse(res, response.error === null ? "Succes!!" : "something, went wrong", response.error);
            });
        });
    });

    /*
    permissionDB.addPermission(req.body.Name, req.body.Role, (response) => {
        sendResponse(res, response.error === null ? "Succes!!" : "something, went wrong", response.error);
    });
    */
};

function removePermission(req, res, next){
    permissionDB.isRoleValid(req.body.Role, (error, isValidRole) => {
        if (error || isValidRole){
            const message = error 
                ? "something went wrong" 
                : 'no such Role';
            sendResponse(res, message, error);
            return;
        }

        permissionDB.removePermission(req.body.userID, req.body.brandID, (response) => {
            sendResponse(res, response.error === null ? "Succes!!" : "something, went wrong", response.error);
        });
    });
};

function sendResponse(res, message, error){
    res.status(error !== undefined ? 400 : 200).json({
        message: message,
        error: error,
    });
}
