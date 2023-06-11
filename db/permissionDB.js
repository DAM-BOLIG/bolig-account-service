// for handling brands and usser permissions
let MysqlPool;


module.exports = (injectedMysqlPool) => {
    MysqlPool = injectedMysqlPool;

    return {
        addPermission,
        addRole,
        removeRole,
        isRoleValid,
        removePermission,
        findRoleID,
        findUserID,
    };
};

function addRole(Role, res){
    const query = `INSERT INTO roles (Role) VALUES ('${Role}')`;
    MysqlPool.query(query, (response) => {
        res(response.error);
    });
};

function removeRole(Role, res){

};

function addPermission(Name, Role, cbFunc){
    /*
    const query = `SET @UID = (SELECT UID FROM users WHERE Name = '${Name}')
                    SET @RoleID = (SELECT RoleID FROM roles WHERE Role = '${Role}')
                    INSERT INTO permission(RoleID, UID) VALUES (@RoleID, @UID);`;
    */
    const query = `INSERT INTO permission(RoleID, UID) VALUES (${Role},${Name});`;
    MysqlPool.query(query,cbFunc);
};

function findRoleID(Role, cbFunc){
    const query = `SELECT RoleID FROM roles WHERE Role = '${Role}';`;
    MysqlPool.query(query, cbFunc);
};

function findUserID(Name, cbFunc){
    const query = `SELECT UID FROM users WHERE Name = '${Name}'`;
    MysqlPool.query(query, cbFunc);
};


function removePermission(RoleID, userID, cbFunc){
    const query = `DELETE FROM permission WHERE RoleID = '${RoleID}' AND UID = '${userID}'`;
    MysqlPool.query(query, cbFunc);
};


function isRoleValid(Role, res){
    const query = `SELECT * FROM roles WHERE Role = '${Role}'`;
    MysqlPool.query(query, (response) => {
        const isValidBrand = response.results ? !(response.results.length > 0) : null;
        res(response.error, isValidBrand);
    });
};