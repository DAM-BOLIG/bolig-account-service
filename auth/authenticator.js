let userDB

module.exports = (injectedUserDB) => {
    userDB = injectedUserDB;

    return {
        registerUser,
        login,
    }
};

function registerUser(req, res){
    userDB.isValidUser(req.body.name, (error, isValidUser) => {
        if (error || !isValidUser){
            const message = error 
                ? "something went wrong" 
                : 'name already in use already exists';
            sendResponse(res, message, error);
            return;
        } 
    
        userDB.register(req.body.name, req.body.password, req.body.email, req.body.phonenumber, (response) => {
            sendResponse(res, response.error === null ? "Succes!!" : "something, went wrong", response.error);
        });
    });
}

function login(query, res){}

function sendResponse(res, message, error){
    res.status(error !== undefined ? 400 : 200).json({
        message: message,
        error: error,
    });
}