const jwt = require("jsonwebtoken");
const {
    getUserToken
} = require("../api/auth/login/login.model");

module.exports = {
    checkToken: (req, res, next) => {
        let token = req.headers.authorization;
        if (token) {
            // Remove Bearer from string
 //           token = token.slice(7);
            jwt.verify(token, "qwe1234", (err, decoded) => {
                if (err) {
                    return res.json({
                        success: 0,
                        message: "Invalid Token... " + err
                    });
                } else {
                    getUserToken(req.headers.authorization,(err,results) =>{
                        if(err){
                            console.log(err);
                            return res.status(500).json({
                                success: 0,
                                message: "Database connection errror"
                            });
                        }
                        if(results){
                            console.log(results);
                            // if(results.role == 1){
                                req.decoded = decoded;
                                next();
                            // }
 /*                            else{
                                return res.json({
                                    success: 0,
                                    message: "Access Denied!"
                                });
                            } */
                        }else{
                            return res.json({
                                "Message" : "token is not valid"
                            });
                        }
                    });

                }
            });
        } else {
            return res.json({
                success: 0,
                message: "Access Denied! Unauthorized User"
            });
        }
    }
};