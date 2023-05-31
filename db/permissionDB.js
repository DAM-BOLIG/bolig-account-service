// for handling brands and usser permissions
let MysqlPool;


module.exports = (injectedMysqlPool) => {
    MysqlPool = injectedMysqlPool;

    return {
        addPermission,
        addBrand,
        isBrandValid,
    };
};

function addBrand(brandName, res){
    const query = `INSERT INTO brands (BrandName) VALUES ('${brandName}')`;
    MysqlPool.query(query, (response) => {
        res(response.error);
    });
};

function addPermission(userID, brandID, res){
    const query = `INSERT INTO Permision (BrandID, UID) VALUES ('${userID}', '${brandID}')`;
    MysqlPool.query(query, (response) => {
        res(response.error);
    });
};

function isBrandValid(brandName, res){
    const query = `SELECT * FROM brands WHERE BrandName = '${brandName}'`;
    MysqlPool.query(query, (response) => {
        const isValidBrand = response.results ? !(response.results.length > 0) : null;
        res(response.error, isValidBrand);
    });
};