const fsPromises = require("fs").promises;
const fs = require("fs");
const {
    getDirs,
    InsertFabric,
    InsertLining,
    InsertButton,
    deleteFabric,
    deleteLining,
    deleteButton,
    getAllFabrics,
    getAllLinings,
    getAllButtons,
    selectFabricDirById,
    selectLiningDirById,
    selectButtonDirById,
    getAdminMenu
} = require("./admin.model");

const {
    eshots,
    emodel,
    renderFabrics,
    previewLiningRender,
    previewFabricRender,
    previewButtonRender,
    renderLinings,
    renderButtons,
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
        let object = req.params.object;
        getAdminMenu((err,results) => {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    success: 0,
                    message: "Database connection errror"
                });
            }
            let flag = false;
            for(i = 0;i <results.length;i++){
                if(object.includes(results[i].value)){
                    flag = true;
                    object = results[i].value + "s";
                    break;
                }
            }
            if(!flag){
                return res.status(400).json({
                    Success : 0,
                    Message : "invalid parameter sent : " + object
                })
            }
            data = [];
            data["object"] = object;
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
        })
    },
    AddFabric : async (req,res) =>{
        let uploadPath = "";

        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).send('No files were uploaded.');
        }
        console.log(req.files);

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
        iconpath = `.\\public\\listIcons\\fabrics\\`;
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
    AddLining : (req,res) => {
        let lname = req.body.name;
        let lcontent = req.body.content;
        let lprice = req.body.price;
        let lcolor = req.body.color;
        let ldirname = req.body.name.toLowerCase();
        
        Icon = req.files.Icon;
      
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).send('No files were uploaded.');
        }

        iconpath = `.\\public\\listIcons\\linings\\`;
        Icon.mv(iconpath + `${ldirname}.jpg`,function (err) {
            if(err)
                return res.status(500).send(err);
        })

        iconpath = `${prefix_url}/listIcons/linings/${ldirname}.jpg`

        let data = {name : lname , color : lcolor , content : lcontent , price : lprice , dirname : ldirname,image : iconpath}

        InsertLining(data,(err,results) => {
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
    AddButton : (req,res) => {
        let bname = req.body.name;
        let bcontent = req.body.content;
        let bprice = req.body.price;
        let bcolor = req.body.color;
        let bdirname = req.body.name.toLowerCase();
        
        Icon = req.files.Icon;
      
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).send('No files were uploaded.');
        }

        iconpath = `.\\public\\listIcons\\buttons\\`;
        Icon.mv(iconpath + `${bdirname}.jpg`,function (err) {
            if(err)
                return res.status(500).send(err);
        })

        iconpath = `${prefix_url}/listIcons/buttons/${bdirname}.jpg`

        let data = {name : bname , color : bcolor , content : bcontent , price : bprice , dirname : bdirname,image : iconpath}

        InsertButton(data,(err,results) => {
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
    FabricRenderPreview : (req,res) =>{
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
        previewFabricRender(suitTile,collarTile,fdirname,(err,str) => {
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
    LiningRenderPreview : (req,res) =>{
        let color = req.body.color;
        previewLiningRender(color,(err,success)=>{
            if(err){
                return res.status(500).json({
                    "Success" : "0",
                    "Message" : err
                })
            }
            res.json({
                preview : `${prefix_url}/uploads/preview/L0001.png`
            })
        });
    },
    ButtonRenderPreview : (req,res) =>{
        let color = req.body.color;
        previewButtonRender(color,(err,success)=>{
            if(err){
                return res.status(500).json({
                    "Success" : "0",
                    "Message" : err
                })
            }
            res.json({
                preview : `${prefix_url}/uploads/preview/B0001.png`
            })
        });
    },
    FabricRender : (req,res) => {
        suitTile = req.body.suitTile
        collarTile = req.body.collarTile
        fdirname = req.body.fdirname

        if(!suitTile)
            return res.json({
                Message : "Suit tile not Set!"
            })
        if(!collarTile){
            return res.json({
                Message : "Collar tile not Set!"
            })
        }
        renderFabrics(suitTile,collarTile,fdirname,(err,str) => {
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
    LiningRender : (req,res) => {
        let color = req.body.color;
        let ldirname = req.body.fdirname;
        if(!color)
        return res.json({
            Message : "Color not Set!"
        })
        if(!ldirname)
        return res.json({
            Message : "Dirname not Set!"
        })
        renderLinings(color,ldirname,(err,str) => {
            if(err){
                res.json({
                    success : 0,
                    message : err
                })
            }
            if(str){
                urls = [];
                for(i = 0;i < emodel.length;i++){
                    address = `${prefix_url}/Linings/m/${emodel[i]}/${ldirname}`
                    for(j = 0;j < eshots.length;j++){
                        url = `${address}/${j+1}/render0001.png`
                        urls.push(url);
                    }
                }
                res.json({
                    success : 1,
                    message : "Linings Rendered Successfully!",
                    images : urls
                })
            }
        })
    },
    ButtonRender : (req,res) => {
        let color = req.body.color;
        let bdirname = req.body.fdirname;
        if(!color)
        return res.json({
            Message : "Color not Set!"
        })
        if(!bdirname)
        return res.json({
            Message : "Dirname not Set!"
        })
        renderButtons(color,bdirname,(err,str) => {
            if(err){
                res.json({
                    success : 0,
                    message : err
                })
            }
            if(str){
                urls = [];
                for(i = 0;i < emodel.length;i++){
                    address = `${prefix_url}/Buttons/m/${emodel[i]}/${bdirname}`
                    for(j = 0;j < eshots.length;j++){
                        url = `${address}/${j+1}/render0001.png`
                        urls.push(url);
                    }
                }
                res.json({
                    success : 1,
                    message : "Buttons Rendered Successfully!",
                    images : urls
                })
            }
        })
    },
    DeleteFabric : (req,res) => { 
        let id = req.params.id;
        let data = {};
        data["id"] = id;
        
        selectFabricDirById(data,(err,results) => {
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
                fs.rmdir(uploadpath, { recursive: true },(err) => {
                    if(err){
                        console.log(err);
                        return res.json({
                            "Success" : "0",
                            "Message" : "problem with removing upload directory!"
                        })
                    }
                    console.log("upload Directory removed!");
                    removeAllFabricRenderDirectories(fdirname,0,(err) => {
                        if(err){
                            return res.json({
                                "Success" : "0",
                                "Message" : "problem with removing render directory!"
                            })
                        }
                        fs.unlink(`${local_prefix_url}/listIcons/fabrics/${fdirname}.jpg`,(err) => {
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
    DeleteLining : (req,res) => {
        let id = req.params.id;
        let data = {};
        data["id"] = id;
        
        selectLiningDirById(data,(err,results) => {
            let ldirname = "";
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
                    "Message" : "No Lining Found!"
                })
            }
            ldirname = results[0].dirname;
            deleteLining(data,(err,results) => {
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
                        "Message" : "Lining Not Found!"
                    });
                }
                uploadpath = `${local_prefix_url}/uploads/linings/${ldirname}`;
                removeAllLiningRenderDirectories(ldirname,0,(err) => {
                    if(err){
                        return res.json({
                            "Success" : "0",
                            "Message" : "problem with removing render directory!"
                        })
                    }
                    fs.unlink(`${local_prefix_url}/listIcons/linings/${ldirname}.jpg`,(err) => {
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
    },
    DeleteButton : (req,res) => {
        let id = req.params.id;
        let data = {};
        data["id"] = id;
        
        selectButtonDirById(data,(err,results) => {
            let bdirname = "";
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
                    "Message" : "No Button Found!"
                })
            }
            bdirname = results[0].dirname;
            deleteButton(data,(err,results) => {
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
                        "Message" : "Button Not Found!"
                    });
                }
                uploadpath = `${local_prefix_url}/uploads/buttons/${bdirname}`;
                removeAllButtonRenderDirectories(bdirname,0,(err) => {
                    if(err){
                        return res.json({
                            "Success" : "0",
                            "Message" : "problem with removing render directory!"
                        })
                    }
                    fs.unlink(`${local_prefix_url}/listIcons/buttons/${bdirname}.jpg`,(err) => {
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
    },
    fabricList: (req, res) => {
/*        index = req.param("index")
        ratio = req.param("pageItem")*/
        index = req.query.index
        ratio = req.query.pageItem
        if(index == undefined)
            return res.json({
                "Success" : "0",
                "Message" : "index not set"
            })
        data = {}
        data["ratio"] = ratio
        data["index"] = index
        getAllFabrics(data,(err, results) => {
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
    liningList : (req,res) => {
        index = req.query.index
        ratio = req.query.pageItem
        if(index == undefined)
            return res.json({
                "Success" : "0",
                "Message" : "index not set"
            })
        data = {}
        data["ratio"] = ratio
        data["index"] = index
        getAllLinings(data,(err, results) => {
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
    buttonList : (req,res) => {
        index = req.query.index
        ratio = req.query.pageItem
        if(index == undefined)
            return res.json({
                "Success" : "0",
                "Message" : "index not set"
            })
        data = {}
        data["ratio"] = ratio
        data["index"] = index
        getAllButtons(data,(err, results) => {
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
                        value : item.value,
                        type: item.type,
                        show_name : item.show_name,
                        icon : `${prefix_url}/listIcons/${item.value}s/Main_Icon/${item.value}.svg`
                    }
                )
            });
            res.json(output);
        })
    }
};

function removeAllFabricRenderDirectories(fdirname,i,callBack){
    if(i < emodel.length){
        console.log(`${local_prefix_url}/Fabrics/m/${emodel[i]}/${fdirname}`);
        fs.rmdir(`${local_prefix_url}/Fabrics/m/${emodel[i]}/${fdirname}`, { recursive: true },(err) => {
            if(err){
                callBack(err);
                return;
            }
            i++;
            if(i < emodel.length)
            removeAllFabricRenderDirectories(fdirname,i,callBack);
            else{
                callBack(null);
                return;
            }
        })
    }
}
function removeAllLiningRenderDirectories(fdirname,i,callBack){
    if(i < emodel.length){
        console.log(`${local_prefix_url}/Linings/m/${emodel[i]}/${fdirname}`);
        fs.rmdir(`${local_prefix_url}/Linings/m/${emodel[i]}/${fdirname}`, { recursive: true },(err) => {
            if(err){
                callBack(err);
                return;
            }
            i++;
            if(i < emodel.length)
            removeAllLiningRenderDirectories(fdirname,i,callBack);
            else{
                callBack(null);
                return;
            }
        })
    }
}
function removeAllButtonRenderDirectories(fdirname,i,callBack){
    if(i < emodel.length){
        console.log(`${local_prefix_url}/Buttons/m/${emodel[i]}/${fdirname}`);
        fs.rmdir(`${local_prefix_url}/Buttons/m/${emodel[i]}/${fdirname}`, { recursive: true },(err) => {
            if(err){
                callBack(err);
                return;
            }
            i++;
            if(i < emodel.length)
            removeAllButtonRenderDirectories(fdirname,i,callBack);
            else{
                callBack(null);
                return;
            }
        })
    }
}
