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
    },
    checkModes : (req,res,next) => {
        let i = 0;
        checkModesRecursive(req,i,(err,succ) => {
            if(err == 1){
                return res.status(401).json({
                    "Success" : "0",
                    "Message" : "Mode not exist"
                })
            }
            else if(err != null && err != 1){
                return res.json(503).json({
                    "Success" : "0",
                    "Message" : "Database Connection Error"
                })
            }
            else{
                next();
            }
        })
    }
};
function checkModesRecursive(req,i,callback){
    if(i >= req.body.length){
        callback(null,1);
        return;
    }
    let mode = req.body[i].mode;
    let data = [];
    data["mode"] = mode;
    checkModeExists(data,(err,results) => {
        if(err){
            callback(err,null);
            return;
        }            
        if(results[0].mode > 0){
            i++;
            checkModesRecursive(req,i,callback);
        }
        else{
            callback(1,null);
            return;
        }
    })
}