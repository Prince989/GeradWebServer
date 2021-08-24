const pool = require("../../config/database");

module.exports = {
    getModes : (callback) => {
        pool.query(
            `Select * From modes`,
            [],
            (error, results, fields) => {
                if (error) {
                    callback(error);
                }
                return callback(null, results);
            }
        );
    },
    getDefaultFabric : (callBack) => {
        pool.query(
                `Select name , image , dirname From fabrics limit 1`,
            [],
            (error, results, fields) => {
                if (error) {
                    callBack(error);
                }
                return callBack(null, results);
            }
        );
    },
    getDefaultLining : (callBack) => {
        pool.query(
                `Select name , image, dirname From linings limit 1`,
            [],
            (error, results, fields) => {
                if (error) {
                    callBack(error);
                }
                return callBack(null, results);
            }
        );
    },
    getDefaultButton : (callBack) => {
        pool.query(
            `Select name , image, dirname From buttons limit 1`,
            [],
            (error, results, fields) => {
                if (error) {
                    callBack(error);
                }
                return callBack(null, results);
            }
        );
    },
    getAllMaterials : (data,callback) => {
        pool.query(
            `Select ma.id , name , image , content , price From materials ma inner join modes mo on ma.mode = mo.id where mo.title = ?`,
        [
            data.mode
        ],
        (error, results, fields) => {
            if (error) {
                callback(error);
            }
            return callback(null, results);
        });
    },
    getMaterialDir : (data,callback) => {
        pool.query(
            `Select dirname From materials where id = ?`,
        [
            data.id
        ],
        (error, results, fields) => {
            if (error) {
                callback(error);
            }
            return callback(null, results);
        });
    },
    getFabricDir: (id, callBack) => {
        pool.query(
            `Select dirname From fabrics where id = ?`,
            [
                id
            ],
            (error, results, fields) => {
                if (error) {
                    callBack(error);
                }
                return callBack(null, results);
            }
        );
    },
    getLiningDir: (id, callBack) => {
        pool.query(
            `Select dirname From linings where id = ?`,
            [
                id
            ],
            (error, results, fields) => {
                if (error) {
                    callBack(error);
                }
                return callBack(null, results);
            }
        );
    },
    getButtonDir: (id, callBack) => {
        pool.query(
            `Select dirname From buttons where id = ?`,
            [
                id
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