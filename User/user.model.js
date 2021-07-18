const pool = require("../../config/database");

module.exports = {
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
    getAllFabrics: (callBack) => {
        pool.query(
                `Select name , image , content , price From fabrics`,
            [],
            (error, results, fields) => {
                if (error) {
                    callBack(error);
                }
                return callBack(null, results);
            }
        );
    },
    getAllLinings: (callBack) => {
        pool.query(
                `Select name , image , content , price From linings`,
            [
                data.first_name,
                data.last_name,
                data.gender,
                data.email,
                data.password,
                data.number
            ],
            (error, results, fields) => {
                if (error) {
                    callBack(error);
                }
                return callBack(null, results);
            }
        );
    },
    getAllButtons: (callBack) => {
        pool.query(
                `Select name , image , content , price From buttons`,
            [],
            (error, results, fields) => {
                if (error) {
                    callBack(error);
                }
                return callBack(null, results);
            }
        );
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