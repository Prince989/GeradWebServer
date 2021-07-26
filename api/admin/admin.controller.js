const fsPromises = require("fs").promises;
const {
    getDirs,
    InsertFabric,

} = require("./admin.model");

const {
    renderPreview
} = require("../../command.handler");

//const { hashSync, genSaltSync, compareSync } = require("bcrypt");
const { sign } = require("jsonwebtoken");
const prefix_url = "http://192.168.10.120:8080";

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
        AlphaMap = req.files.AlphaMap;
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
        AlphaMap.mv(uploadPath + "AlphaMap.jpg", function (err) {
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
            else{
                res.json({
                    success: 1,
                    message: "Added Successfully"
                })
            }
        });
    },
    RenderPreview : (req,res) =>{
        suitTile = req.body.suitTile
        collarTile = req.body.collarTile
        fdirname = req.body.fdirname

        if(!suitTile)
            res.json({
                Message : "Suit tile not Set!"
            })
        if(!collarTile){
            res.json({
                Message : "Collar tile not Set!"
            })
        }
        renderPreview(suitTile,collarTile,fdirname,(err,str) => {
            if(err){
                res.json({
                    success : 0,
                    message : err
                })
            }
            if(str){
                res.json({
                    success : 1,
                    message : "Preview Rendered Successfully!",
                    url : `${prefix_url}/uploads/preview/0001.png`
                })
            }
        })
    }
};
