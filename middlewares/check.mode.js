const {
    checkModeExists
} = require("../api/admin/admin.model");

module.exports = {
    checkMode: (req, res, next) => {
        let mode = req.params.mode;
        let data = [];
        data["mode"] = mode;
        checkModeExists(data,(err,results) => {
            if(err){
                return res.json({
                    "Success" : "0",
                    "Message" : "Problem with database : " + err
                })
            }
            if(results[0].mode > 0){
                next();
            }
            else{
                return res.json({
                    "Success" : "0",
                    "Message" : "Mode not exists"
                })
            }

        })
    }
};