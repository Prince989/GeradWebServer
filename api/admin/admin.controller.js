const fsPromises = require("fs").promises;
const {
    getDirs,
    InsertFabric,

} = require("./admin.model");
//const { hashSync, genSaltSync, compareSync } = require("bcrypt");
const { sign } = require("jsonwebtoken");

async function createDir(dir) {
    try {
        await fsPromises.access(dir, fs.constants.F_OK);
    } catch (e) {
        await fsPromises.mkdir(dir);
    }
}

module.exports = {
    fetchDirs : (req,res) =>{
        getDirs((err,results) => {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    success: 0,
                    message: "Database connection errror"
                });
            }
            let output = [];
            results.map(item => {
                output.push(
                    {
                        "dirname": item.dirname
                    }
                )
            });
            res.json(output);
        })
    },
    AddFabric : async (req,res) =>{
        let uploadPath = "";

        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).send('No files were uploaded.');
        }
    
        let fname = req.body.name;
        let fcontent = req.body.content;
        let fprice = req.body.price;
    
        let fdirname = req.body.name.toLowerCase();
    
        DiffuseMap = req.files.DiffuseMap;
        NormalMap = req.files.NormalMap;
        AmbientMap = req.files.AmbientMap;
        RoughnessMap = req.files.RoughnessMap;
        MetalMap = req.files.MetalMap;
        try{
            await createDir(`.\\public\\uploads\\fabrics\\${fdirname}`);
        }catch(e){
            res.json({
                "Message" : "Directory Exists, Please remove it first"
            });
        }
        uploadPath = `.\\public\\uploads\\fabrics\\${fdirname}\\`;
    
        DiffuseMap.mv(uploadPath + "DiffuseMap.jpg", function (err) {
            if (err)
                return res.status(500).send(err);
        });
        NormalMap.mv(uploadPath + "NormalMap.jpg", function (err) {
            if (err)
                return res.status(500).send(err);
        });
        RoughnessMap.mv(uploadPath + "RoughnessMap.jpg", function (err) {
            if (err)
                return res.status(500).send(err);
        });
        AmbientMap.mv(uploadPath + "AmbientMap.jpg", function (err) {
            if (err)
                return res.status(500).send(err);
        });
        MetalMap.mv(uploadPath + "MetalMap.jpg", function (err) {
            if (err)
                return res.status(500).send(err);
        });

        let data = {name : fname , content : fcontent , price : fprice , dirname : fdirname}

        InsertFabric(data,(err,results) => {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    success: 0,
                    message: "Database connection errror"
                });
            }
            res.json({
                success: 1,
                message: "Added Successfully"
            })
        });
    }
};
