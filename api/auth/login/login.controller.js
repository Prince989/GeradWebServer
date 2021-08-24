const{
    getUserByUserEmail,
    saveToken,

} = require("./login.model");

const { sign } = require("jsonwebtoken");

module.exports = {
    login : (req,res) => {
        const body = req.body;
        getUserByUserEmail(body.email, (err, results) => {
          if (err) {
            console.log(err);
          }
          if (!results) {
            return res.json({
              success: 0,
              data: "Invalid email or password"
            });
          }
          const result = (body.password === results.password);
          if (result) {
            results.password = undefined;
            const jsontoken = sign({ result: results }, "qwe1234", {
              expiresIn: "3h"
            });
            saveToken(jsontoken,body.email,(err,result) => {
                if(err){
                    console.log(err);
                    return res.status(500).json({
                        success: 0,
                        message: "Database connection errror"
                    });
                }
                return res.json({
                    success: 1,
                    message: "login successfully",
                    token: jsontoken
                  });
            })
          } else {
            return res.json({
              success: 0,
              data: "Invalid email or password"
            });
          }
        });
    }
}