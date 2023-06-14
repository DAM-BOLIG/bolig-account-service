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
        removePermissionOnlyName,
    };
};

function addRole(Role, cbFunc){
    const query = `INSERT INTO roles (Role) VALUES ('${Role}')`;
    MysqlPool.query(query, cbFunc);
};

function removeRole(Role, cbFunc){
    const query = `DELETE FROM roles WHERE Role = '${Role}'`;
    MysqlPool.query(query, cbFunc);
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

function removePermissionOnlyName(NameID, cbFunc){
    const query = `DELETE FROM permission WHERE UID = '${NameID}'`;
    MysqlPool.query(query, cbFunc);
};


function isRoleValid(Role, res){
    const query = `SELECT * FROM roles WHERE Role = '${Role}'`;
    MysqlPool.query(query, (response) => {
        const isValidBrand = response.results ? !(response.results.length > 0) : null;
        res(response.error, isValidBrand);
    });
};