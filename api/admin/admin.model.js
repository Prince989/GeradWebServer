const pool = require("../../config/database");

module.exports = {
    getDirs : (data,callBack) => {
        let obj = data.object
        pool.query(
            `Select dirname From ${obj}`,
            [
            ],
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
    InsertLining : (data,callBack) => {
        pool.query(
            `Insert into linings (name,color,content,price,dirname,image) Values(?,?,?,?,?,?)`,
            [
                data.name,
                data.color,
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
    deleteLining : (data,callback)=> {
        pool.query(
            `delete from linings where id = ?`,
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
    selectFabricDirById : (data,callback) => {
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
    selectLiningDirById : (data,callback) => {
        pool.query(
            `select dirname from linings where id = ?`,
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
    },
    getAllLinings : (data,callBack) => {
        let ratio = parseInt(data.ratio);
        let from = parseInt(data.index * ratio);
        pool.query(
                `Select id , name , image , content , price From linings limit ? , ?`,
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
    }, 
    getAdminMenu : (callBack) => {
        pool.query(
            `Select * From admin_menu`,
            [],
            (error, results, fields) => {
                if (error) {
                    callBack(error);
                }
                return callBack(null, results);
            }
        );
    }
};