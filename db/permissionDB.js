// for handling brands and usser permissions
let MysqlPool;


module.exports = (injectedMysqlPool) => {
    MysqlPool = injectedMysqlPool;

    return {
        addPermission,
        addRole,
        isRoleValid,
        removePermission,
    };
};

function addRole(Role, res){
    const query = `INSERT INTO roles (Role) VALUES ('${Role}')`;
    MysqlPool.query(query, (response) => {
        res(response.error);
    });
};

function addPermission(Name, Role, cbFunc){
    /*
    const query = `SET @UID = (SELECT UID FROM users WHERE Name = '${UserName}');
                    SET @RoleID = (SELECT RoleID FROM roles WHERE Role = '${Role}');
                    INSERT INTO permission(RoleID, UID) VALUES (@RoleID, @UID);`;
    */
    const query = `SET @UID = (SELECT UID FROM users WHERE Name = '${Name}');
                    SET @RoleID = (SELECT RoleID FROM roles WHERE Role = '${Role}');
                    INSERT INTO permission(RoleID, UID) VALUES (@RoleID, @UID);`;

    MysqlPool.query(query,cbFunc);
};

function removePermission(RoleID, userID, res){
    const query = `DELETE FROM permission WHERE RoleID = '${RoleID}' AND UID = '${userID}'`;
    MysqlPool.query(query, (response) => {
        res(response.error);
    });
};

function isRoleValid(Role, res){
    const query = `SELECT * FROM roles WHERE Role = '${Role}'`;
    MysqlPool.query(query, (response) => {
        const isValidBrand = response.results ? !(response.results.length > 0) : null;
        res(response.error, isValidBrand);
    });
};