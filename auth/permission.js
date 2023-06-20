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
        removeRole,
        getRoles,
        addPermission,
        removePermissionByName,
        removePermissionOnlyName,
        removePermissionByID,
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
            sendResponse(res, response.error === null ? "Role Added!!" : "something, went wrong", response.error);
        });
    });
};

function removeRole(req, res){
    permissionDB.isRoleValid(req.body.Role, (error, isValidRole) => {
        if (error || isValidRole){
            const message = error 
                ? "something went wrong" 
                : 'no such Role';
            sendResponse(res, message, error);
            return;
        }
        permissionDB.removeRole(req.body.Role, (response) => {
            sendResponse(res, response.error === null ? "Role Removed!!" : "something, went wrong", response.error);
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

function removePermissionByName(req, res){
    permissionDB.findRoleID(req.body.Role, (response) => {
        const roleID = response.results[0].RoleID;
        permissionDB.findUserID(req.body.Name, (response) => {
            const userID = response.results[0].UID;
            permissionDB.removePermission(roleID, userID, (response) => {
                sendResponse(res, response.error === null ? "Succes!!" : "something, went wrong", response.error);
            });
        });
    });
};

function removePermissionOnlyName(req, res, next){
    permissionDB.findUserID(req.body.name, (response) => {
        const userID = response.results[0].UID;
        permissionDB.removePermissionOnlyName(userID, (response) => {
            if (response.error !== null){
                sendResponse(res, "something, went wrong", response.error);
                return;
            }
            next();
        });
    });
}

function getRoles(req, res){
    permissionDB.getRoles((response) => {
        sendResponse(res, response.results.length === null ? "No Results" : response.results, response.error );
    });
};

function removePermissionByID(req, res){
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
