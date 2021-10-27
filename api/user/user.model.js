const pool = require("../../config/database");

module.exports = {
  getModes: (callback) => {
    pool.query(
      `SELECT m1.id as modeid,title,show_name,type,materials.id as matid,image,dirname,price from modes m1 inner join materials on m1.id = materials.mode GROUP by m1.id`,
      [],
      (error, results, fields) => {
        if (error) {
          callback(error);
        }
        return callback(null, results);
      }
    );
  },
  getDefaultFabric: (callBack) => {
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
  getDefaultLining: (callBack) => {
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
  getDefaultButton: (callBack) => {
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
  getAllMaterials: (data, callback) => {
    pool.query(
      `Select ma.id , name , image , content , price From materials ma inner join modes mo on ma.mode = mo.id where mo.title = ?`,
      [data.mode],
      (error, results, fields) => {
        if (error) {
          callback(error);
        }
        return callback(null, results);
      }
    );
  },
  getMaterialDir: (data, callback) => {
    pool.query(
      `Select dirname From materials where id = ?`,
      [data.id],
      (error, results, fields) => {
        if (error) {
          callback(error);
        }
        return callback(null, results);
      }
    );
  },
  getFabricDir: (id, callBack) => {
    pool.query(
      `Select dirname From fabrics where id = ?`,
      [id],
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
      [id],
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
      [id],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        }
        return callBack(null, results);
      }
    );
  },
  setVerificationCode: (data, callback) => {
    pool.query(
      "INSERT INTO verification_code (mobile,code) values (?,?)",
      [data.mobile, data.code],
      (err, results, field) => {
        if (err) {
          callback(err, null);
          return;
        }
        callback(null, results);
      }
    );
  },
  updateVerificationCode: (data, callback) => {
    pool.query(
      "UPDATE verification_code SET code = ? WHERE mobile = ?",
      [data.code, data.mobile],
      (err, results, field) => {
        if (err) {
          callback(err, null);
          return;
        }
        callback(null, results);
      }
    );
  },
  checkMobile: (table, data, callBack) => {
    pool.query(
      `SELECT * FROM ${table} where mobile = ?`,
      [data.mobile],
      (err, results, field) => {
        if (err) {
          console.log(err);
          callBack(err, null);
          return;
        } else {
          callBack(null, results);
        }
      }
    );
  },
  setUser: (data, token, callBack) => {
    pool.query(
      "Replace into `users` (`id`,`mobile`,`role`,`token`) values ((select u.id from `users` u where mobile = ?),?,0,?)",
      [data.mobile, data.mobile, token],
      (err, results, field) => {
        if (err) {
          callBack(err, null);
          return;
        }
        callBack(null, results);
      }
    );
  },
  fetchSizeElements: (data, callback) => {
    pool.query(
      "SELECT * FROM `sizes` WHERE ? >= waist_min and ? <= waist_max order by shoulder asc",
      [data.waist, data.waist],
      (err, results, field) => {
        if (err) {
          console.log(err);
          callback(err, null);
          return;
        } else {
          callback(null, results);
        }
      }
    );
  },
  fetchCart: (data, callBack) => {
    pool.query(
      "SELECT c.* FROM carts c INNER JOIN users u on u.id = c.user_id where u.token = ?",
      [data],
      (err, result, fiels) => {
        if (err) {
          console.log(err);
          callBack(err, null);
          return;
        } else {
          callBack(null, result);
        }
      }
    );
  },
  updateSize: (data, callBack) => {
    pool.query(
      "Update users Set size = ? where token = ?",
      [data.size, data.token],
      (err, result, fields) => {
        if (err) {
          console.log(err);
          callBack(err, null);
          return;
        } else {
          callBack(null, result);
        }
      }
    );
  },
  fetchProfile: (data, callBack) => {
    pool.query(
      "Select * from users where token = ?",
      [data.token],
      (err, result, fields) => {
        if (err) {
          console.log(err);
          callBack(err, null);
          return;
        } else {
          callBack(null, result);
        }
      }
    );
  },
  updateProfile: (data, callBack) => {
    pool.query(
      "Update users Set firstName = ? , lastName = ? , email = ? , city = ?, national_code = ? , address = ? , postCode = ?  where token = ?",
      [
        data.firstName,
        data.lastName,
        data.email,
        data.city,
        data.national_code,
        data.address,
        data.postCode,
        data.token,
      ],
      (err, result, fields) => {
        if (err) {
          console.log(err);
          callBack(err, null);
          return;
        } else {
          callBack(null, result);
        }
      }
    );
  },
  setProfile: (data, callBack) => {
    pool.query(
      "Update users Set  where token = ?",
      [data.size, data.token],
      (err, result, fields) => {
        if (err) {
          console.log(err);
          callBack(err, null);
          return;
        } else {
          callBack(null, result);
        }
      }
    );
  },
  setFavorites : (data,callBack) => {
    pool.query(
        "Replace into `favorites` (`data`,`user_id`,`image`) values (?,?,?)",
        [
            data.data,
            data.user_id,
            data.image
        ],
        (err, result, fields) => {
          if (err) {
            console.log(err);
            callBack(err, null);
            return;
          } else {
            callBack(null, result);
          }
        }
      );
  },
  fetchFavorites : (token,callBack) => {
    pool.query(
        "Select favorties.* from users u inner join favorites f on u.id = f.user_id where u.token = ?",
        [
            token
        ],
        (err, result, fields) => {
          if (err) {
            console.log(err);
            callBack(err, null);
            return;
          } else {
            callBack(null, result);
          }
        }
      );
  }
};
