const pool = require("../../config/database");

module.exports = {
    getDirs : (callBack) => {
        pool.query(
            `Select dirname From fabrics`,
            [],
            (error, results, fields) => {
                if (error) {
                    callBack(error);
                }
                return callBack(null, results);
            }
        );
    },
    InsertFabric : (data,callBack) => {
        pool.query(
            `Insert into fabrics (name,content,price,dirname) Values(?,?,?,?)`,
            [
                data.name,
                data.content,
                data.price,
                data.dirname
            ],
            (error, results, fields) => {
                if (error) {
                    callBack(error);
                }
                return callBack(null, results);
            }
        );
    }
};