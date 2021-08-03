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
            `Insert into fabrics (name,content,price,dirname,image) Values(?,?,?,?,?)`,
            [
                data.name,
                data.content,
                data.price,
                data.dirname,
                data.image
            ],
            (error, results, fields) => {
                if (error) {
                    callBack(error);
                }
                return callBack(null, results);
            }
        );
    },
    deleteFabric : (data,callback)=> {
        pool.query(
            `delete from fabrics where id = ?`,
            [
                data.id
            ],
            (error, results, fields) => {
                if (error) {
                    callback(error);
                }
                return callback(null, results);
            }
        );
    },
    selectDirById : (data,callback) => {
        pool.query(
            `select dirname from fabrics where id = ?`,
            [
                data.id
            ],
            (error, results, fields) => {
                if (error) {
                    callback(error);
                }
                return callback(null, results);
            }
        );
    },
    getAllFabrics: (data,callBack) => {
        let ratio = parseInt(data.ratio);
        let from = parseInt(data.index * ratio);
        pool.query(
                `Select id , name , image , content , price From fabrics limit ? , ?`,
            [
                from,
                ratio
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