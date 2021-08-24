const fsPromises = require("fs").promises;
const fs = require("fs");

const {
    getDirs,
    getAllMaterials,
    selectMaterialDirById,
    InsertMaterial,
    getAdminMenu,
    getTiles,
    deleteMaterial
} = require("./admin.model");

const {
    eshots,
    emodel,
    renderPreview,
    finalRender
} = require("../../command.handler");

//const { hashSync, genSaltSync, compareSync } = require("bcrypt");
const { sign } = require("jsonwebtoken");
const prefix_url = "http://192.168.10.120:8080";
const local_prefix_url = "E:/GeradWebServer-PhotoShop/public/";

async function createDir(dir) {
    try {
        await fsPromises.access(dir, fs.constants.F_OK);
    } catch (e) {
        await fsPromises.mkdir(dir);
    }
}

module.exports = {
    fetchDirs : (req,res) =>{
        let mode = req.params.mode
        let data = {mode : mode}
        getDirs(data,(err,results) => {
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
    AddMaterial : (req,res) =>{
        let uploadPath = "";

        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).send('No files were uploaded.');
        }
        console.log(req.files);

        let fname = req.body.name;
        let fcontent = req.body.content;
        let fprice = req.body.price;
        let mode = req.params.mode;
        let fdirname = req.body.name.toLowerCase();
    
        DiffuseMap = req.files.DiffuseMap;
        Icon = req.files.Icon;

        try{
            createDir(`.\\public\\uploads\\${mode}s\\${fdirname}`);
        }catch(e){
            res.status(401).json({
                "Message" : "Directory Exists, Please remove it first"
            });
            return;
        }
        uploadPath = `.\\public\\uploads\\${mode}s\\${fdirname}\\`;
    
        DiffuseMap.mv(uploadPath + "upload.jpg", function (err) {
            if (err)
                return res.status(500).send(err);
        });
        iconpath = `.\\public\\listIcons\\${mode}s\\`;
        Icon.mv(iconpath + `${fdirname}.jpg`,function (err) {
            if(err)
                return res.status(500).send(err);
        })
        iconpath = `${prefix_url}/listIcons/${mode}s/${fdirname}.jpg`
        let data = {name : fname , content : fcontent , price : fprice , dirname : fdirname,image : iconpath, mode : mode}
        InsertMaterial(data,(err,results) => {
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
    DeleteMaterial : (req,res) => { 
        let id = req.params.id;
        let data = {};
        let mode = req.params.mode
        data["id"] = id;
        
        selectMaterialDirById(data,(err,results) => {
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
                    "Message" : `No ${mode} Found!`
                })
            }
            fdirname = results[0].dirname;
            deleteMaterial(data,(err,results) => {
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
                        "Message" : `${mode} Not Found!`
                    });
                }
                uploadpath = `${local_prefix_url}/uploads/${mode}s/${fdirname}`;
                fs.rmdir(uploadpath, { recursive: true },(err) => {
                    if(err){
                        console.log(err);
                        return res.json({
                            "Success" : "0",
                            "Message" : "problem with removing upload directory!"
                        })
                    }
                    console.log("upload Directory removed!");
                    removeAllMaterialRenderDirectories(fdirname,mode,0,(err) => {
                        if(err){
                            return res.json({
                                "Success" : "0",
                                "Message" : "problem with removing render directory!"
                            })
                        }
                        fs.unlink(`${local_prefix_url}/listIcons/${mode}s/${fdirname}.jpg`,(err) => {
                           if(err){
                               console.log(err);
                               return res.json({
                                "Success" : "0",
                                "Message" : "problem with removing icons!"
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
        })
    },
    materialList: (req, res) => {
        index = req.query.index
        ratio = req.query.pageItem
        mode = req.params.mode
        if(index == undefined)
            return res.json({
                "Success" : "0",
                "Message" : "index not set"
            })
        data = {}
        data["ratio"] = ratio
        data["index"] = index
        data["mode"] = mode
        getAllMaterials(data,(err, results) => {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    success: 0,
                    message: "Database connection errror"
                });
            }
            let output = [];
            console.log(results);
            results.map(item => {
                output.push(
                    {
                        "id" : item.id,
                        "name": item.name,
                        "image": item.image,
                        "content": item.content,
                        "price": item.price,
                    }
                )
            });
            res.json(output);
        });
    },
    fetchAdminMenu : (req,res) => {
        getAdminMenu((err,results) => {
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
                        id : item.id,
                        value : item.title,
                        type : item.type,
                        show_name : item.show_name,
                        icon : `${prefix_url}/listIcons/${item.title}s/Main_Icon/${item.title}.svg`
                    }
                )
            });
            res.json(output);
        })
    },
    Render : (req,res) => {
        tile = req.body.tile
        fdirname = req.body.fdirname
        mode = req.params.mode

        if(!tile)
            return res.json({
                Message : "tile not Set!"
            })
        if(!fdirname)
            return res.json({
                Message : "dirname not Set!"
            })
        if(!mode)
            return res.json({
                Message : "mode not Set!"
            })

        finalRender(mode,fdirname,tile,(err,str) => {
            if(err){
                res.json({
                    success : 0,
                    message : err
                })
            }
            if(str){
                urls = [];
                for(i = 0;i < emodel.length;i++){
                    address = `${prefix_url}/${capitalize(mode)}s/m/${emodel[i]}/${fdirname}`
                    for(j = 0;j < eshots.length;j++){
                        url = `${address}/${j+1}/render.png`
                        urls.push(url);
                    }
                }
                res.json({
                    success : 1,
                    message : `${capitalize(mode)}s Rendered Successfully!`,
                    images : urls
                })
            }
        })
    },
    Preview : (req,res) => {
        tile = req.body.tile
        fdirname = req.body.fdirname
        mode = req.params.mode

        if(!tile)
            return res.json({
                Message : "tile not Set!"
            })
        if(!fdirname)
            return res.json({
                Message : "dirname not Set!"
            })
        if(!mode)
            return res.json({
                Message : "mode not Set!"
            })
        
        renderPreview(mode,fdirname,tile,(err,str) => {
            if(err){
                res.json({
                    success : 0,
                    message : err
                })
            }
            if(str){
                urls = [];
                address = `${prefix_url}/${capitalize(mode)}s/m/${emodel[0]}/${fdirname}`
                for(j = 0;j < eshots.length;j++){
                    url = `${address}/${j+1}/render.png`
                    urls.push(url);
                }
                res.json({
                    success : 1,
                    message : `${capitalize(mode)}s Rendered Successfully!`,
                    images : urls
                })
            }
        })
    },
    fetchTiles :  (req,res) => {
        let value = req.params.value;
        let data = [];
        data["value"] = value;
        getTiles(data,(err,results) => {
            if (err) {
                console.log(err);
                return res.status(502).json({
                    success: 0,
                    message: "Database connection errror"
                });
            }
            let output = [];
            results.map(item => {
                output.push(
                    {
                        scale_key : item.scale_key,
                        scale_name : item.scale_name,
                    }
                )
            });
            res.json(output);
        })
    }
};

function removeAllMaterialRenderDirectories(fdirname,mode,i,callBack){
    if(i < emodel.length){
        console.log(`${local_prefix_url}/${capitalize(mode)}s/m/${emodel[i]}/${fdirname}`);
        fs.rmdir(`${local_prefix_url}/${capitalize(mode)}s/m/${emodel[i]}/${fdirname}`, { recursive: true },(err) => {
            if(err){
                callBack(err);
                return;
            }
            i++;
            if(i < emodel.length)
            removeAllMaterialRenderDirectories(fdirname,mode,i,callBack);
            else{
                callBack(null);
                return;
            }
        })
    }
}

function capitalize(s){
    return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}