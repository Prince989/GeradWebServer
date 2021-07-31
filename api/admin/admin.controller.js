const fsPromises = require("fs").promises;
const fs = require("fs");
const {
    getDirs,
    InsertFabric,
    deleteFabric,
    selectDirById
} = require("./admin.model");

const {
    eshots,
    emodel,
    renderPreview,
    previewFabricRenders
} = require("../../command.handler");

//const { hashSync, genSaltSync, compareSync } = require("bcrypt");
const { sign } = require("jsonwebtoken");
const prefix_url = "http://192.168.10.120:8080";
const local_prefix_url = "E:/GeradWebServer/GeradWebServer/public/";

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
        Icon = req.files.Icon;

        try{
            await createDir(`.\\public\\uploads\\fabrics\\${fdirname}`);
        }catch(e){
            res.status(401).json({
                "Message" : "Directory Exists, Please remove it first"
            });
            return;
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
        iconpath = `.\\public\\listIcons\\fabrics\\${fdirname}\\`;
        Icon.mv(iconpath + `${fdirname}.jpg`,function (err) {
            if(err)
                return res.status(500).send(err);
        })
        iconpath = `${prefix_url}/listIcons/fabrics/${fdirname}.jpg`
        let data = {name : fname , content : fcontent , price : fprice , dirname : fdirname,image : iconpath}

        InsertFabric(data,(err,results) => {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    success: 0,
                    message: "Database connection errror"
                });
            }
            else{
                try{
                    res.json({
                        success: 1,
                        message: "Added Successfully"
                    })
                }catch(e){
                    console.log(e);
                }
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
    },
    FabricRender : (req,res) => {
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
        previewFabricRenders(suitTile,collarTile,fdirname,(err,str) => {
            if(err){
                res.json({
                    success : 0,
                    message : err
                })
            }
            if(str){
                urls = [];
                for(i = 0;i < emodel.length;i++){
                    address = `${prefix_url}/Fabrics/m/${emodel[i]}/${fdirname}`
                    for(j = 0;j < eshots.length;j++){
                        url = `${address}/${j+1}/render0001.png`
                        urls.push(url);
                    }
                }
                res.json({
                    success : 1,
                    message : "Fabrics Rendered Successfully!",
                    images : urls
                })
            }
        })
    },
    DeleteFabric : (req,res) => { 
        let id = req.params.id;
        let data = {};
        data["id"] = id;
        
        selectDirById(data,(err,results) => {
            let fdirname = "";
            if(err){
                console.log(err);
                return res.json({
                    "Success" : "0",
                    "Message" : "Database connection error"
                })
            }
            if(results.length < 1){
                return res.json({
                    "Success" : "0",
                    "Message" : "No Fabric Found!"
                })
            }
            fdirname = results[0].dirname;
            deleteFabric(data,(err,results) => {
                if(err){
                    console.log(err);
                    return res.json({
                        "Success" : 0,
                        "Message" : err
                    })
                }
                if(results.affectedRows < 1){
                    return res.json({
                        "Success" : "1",
                        "Message" : "Fabric Not Found!"
                    });
                }
                uploadpath = `${local_prefix_url}/uploads/fabrics/${fdirname}`;
                fs.rmdir(uploadpath, { recursive: false },(err) => {
                    if(err){
                        return res.json({
                            "Success" : "0",
                            "Message" : "problem with removing upload directory!"
                        })
                    }
                    console.log("upload Directory removed!");
                    removeAllRenderDirectories(fdirname,0,(err) => {
                        if(err){
                            return res.json({
                                "Success" : "0",
                                "Message" : "problem with removing render directory!"
                            })
                        }
                        return res.json({
                            "Success" : 1,
                            "Message" : "Deleted SuccessFully!"
                        })
                    })
                })
            })
        })
    }
};

function removeAllRenderDirectories(fdirname,i,callBack){
    if(i < emodel.length){
        console.log(`${local_prefix_url}/Fabrics/m/${emodel[i]}/${fdirname}`);
        fs.rmdir(`${local_prefix_url}/Fabrics/m/${emodel[i]}/${fdirname}`, { recursive: false },(err) => {
            if(err){
                callBack(err);
                return;
            }
            i++;
            if(i < emodel.length)
                removeAllRenderDirectories(fdirname,i,callBack);
            else{
                callBack(null);
                return;
            }
        })
    }
}
