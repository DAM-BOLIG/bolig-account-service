let tokenDB;
let permissionDB;

module.exports = (injectedTokenDB, injectedPermissionDB) => {
    tokenDB = injectedTokenDB;
    permissionDB = injectedPermissionDB;

    return {
        createBrand,
        addPermission,
        grantPermission,
    };
}

function createBrand(req, res){
    permissionDB.isBrandValid(req.body.brandName, (error, isValidBrand) => {
        if (error || !isValidBrand){
            const message = error 
                ? "something went wrong" 
                : 'brand already exists';
            sendResponse(res, message, error);
            return;
        } 
    
        permissionDB.addBrand(req.body.brandName, (response) => {
            sendResponse(res, response.error === null ? "Succes!!" : "something, went wrong", response.error);
        });
    });
};

function addPermission(req,res){
    permissionDB.addPermission(req.body.userID, req.body.brandID, (response) => {
        sendResponse(res, response.error === null ? "Succes!!" : "something, went wrong", response.error);
    });
};

function grantPermission(req, res, next){

};

function sendResponse(res, message, error){
    res.status(error !== undefined ? 400 : 200).json({
        message: message,
        error: error,
    });
}
