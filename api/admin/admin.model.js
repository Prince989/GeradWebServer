const pool = require("../../config/database");

module.exports = {
    getDirs : (data,callBack) => {
        pool.query(
            `Select dirname From materials ma Inner Join modes mo on ma.mode = mo.id where mo.title = ?`,
            [
                data.mode
            ],
            (error, results, fields) => {
                if (error) {
                    callBack(error);
                }
                return callBack(null, results);
            }
        );
    },
    InsertMaterial : (data,callBack) => {
        pool.query(
            `Insert into materials (name,content,price,dirname,image,mode) Values(?,?,?,?,?,(select id from modes where title = ?))`,
            [
                data.name,
                data.content,
                data.price,
                data.dirname,
                data.image,
                data.mode
            ],
            (error, results, fields) => {
                if (error) {
                    callBack(error);
                }
                return callBack(null, results);
            }
        );
    },
    deleteMaterial : (data,callback)=> {
        pool.query(
            `delete from materials where id = ?`,
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
    selectMaterialDirById : (data,callback) => {
        pool.query(
            `select dirname from materials where id = ?`,
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
    getAllMaterials :  (data,callBack) => {
        let ratio = parseInt(data.ratio);
        let from = parseInt(data.index * ratio);
        pool.query(
                `Select ma.id , name , image , content , price From materials ma inner join modes mo on ma.mode = mo.id where mo.title = ? limit ? , ?`,
            [
                mode,
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
            `Select * From modes`,
            [],
            (error, results, fields) => {
                if (error) {
                    callBack(error);
                }
                return callBack(null, results);
            }
        );
    },
    getTiles : (data,callBack) => {
        pool.query(
            `Select scale_key,scale_name From modes inner join texture_scale on modes.id = texture_scale.object_id where modes.title = ? `,
            [
                data.value
            ],
            (error, results, fields) => {
                if (error) {
                    callBack(error);
                }
              return callBack(null, results);
            }
        );
    }, 
    checkModeExists : (data,callback) => {
        pool.query(
            `Select count(*) as mode from modes where title = ?`,
            [
                data.mode
            ],
            (error, results, fields) => {
                if (error) {
                    callback(error);
                }
                return callback(null, results);
            }
        );
    }
};