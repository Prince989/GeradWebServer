const pool = require("../../../config/database");

module.exports = {
    getUserByUserEmail: (email, callBack) => {
        pool.query(
          `select * from users where email = ?`,
          [email],
          (error, results, fields) => {
            if (error) {
              callBack(error);
            }
            return callBack(null, results[0]);
          }
        );
    },
    saveToken : (token , email ,callBack) => {
        pool.query(
            `update users Set token = ? where email = ?`,
            [token , email],
            (error, results, fields) => {
              if (error) {
                callBack(error);
              }
              return callBack(null, results[0]);
            }
        );
    },
    getUserToken : (token , callBack) =>{
        pool.query(
            `select role from users where token = ?`,
            [token],
            (error, results, fields) => {
              if (error) {
                callBack(error);
              }
              return callBack(null, results[0]);
            }
          );
    }
}