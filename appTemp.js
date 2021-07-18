const mysql = require('mysql');
const express = require('express');
var cors = require('cors');
const app = express();
const prefix_url = "http://192.168.10.66:8080/";
const postfix_url = "render.png";
const fileUpload = require('express-fileupload');
const fsPromises = require("fs").promises;

let connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'tailor'
});
app.use(cors());
let options = {
    redirect: false
}
app.use(express.static('public', options));

app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/'
}));
app.get("/api/default/fetch/all", function (req, res) {
    defaultFetchAll(res);
});

app.get("/api/fabric/list/fetch", function (req, res) {
    fetchAllFabrics(res);
});

app.get("/api/lining/list/fetch", function (req, res) {
    try {
        fetchAllLinings(res);
    } catch (err) {
        console.log(err);
    }
});

app.get("/api/button/list/fetch", function (req, res) {
    try {
        fetchAllButtons(res);
    } catch (err) {
        console.log(err);
    }
});

app.get("/api/:fabricId/:liningId/:buttonId/:size/:model/:shot", function (req, res) {
    try {
        setRenders(req, res);
    } catch (err) {
        console.log(err);
    }
});

app.get("/api/get/dirs", function (req, res) {
    fetchAllDirectory(res);
});

app.post("/api/upload", async function (req, res) {
    let uploadPath = "";

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    let name = req.body.name;
    let content = req.body.content;
    let price = req.body.price;

    let dirname = req.body.name.toLowerCase();

    DiffuseMap = req.files.DiffuseMap;
    NormalMap = req.files.NormalMap;
    AmbientMap = req.files.AmbientMap;
    RoughnessMap = req.files.RoughnessMap;
    MetalMap = req.files.MetalMap;

    await createDir(`.\\public\\uploads\\fabrics\\${dirname}`);

    uploadPath = `.\\public\\uploads\\fabrics\\${dirname}\\`;

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


    try {
        connection.query(`Insert into fabrics  (name,content,price,dirname) Values('${name}','${content}','${price}','${dirname}')`, function (error, results, fields) {
            if (error) {
                console.log((error));
                res.json({
                    "Message": "Failed to connect database"
                })
            } else {
                res.send({"message": "Success"});
            }
        });
    } catch (err) {
        console.log(err);
    }
});


app.get("/api/button/list/fetch", function (req, res) {
    fetchAllButtons(res);
});

app.listen(8080, function () {
    console.log("Server is running on 8080 port: ");
});

function defaultFetchAll(res) {

    let FabricUrl = "";
    let LiningUrl = "";
    let ButtonUrl = "";

    let fabricIcon = "";
    let liningIcon = "";
    let buttonIcon = "";

    let fabricName = "";
    let liningName = "";
    let buttonName = "";

    FabricUrl = prefix_url + "Fabrics/m/1/";
    LiningUrl = prefix_url + "Linings/m/1/";
    ButtonUrl = prefix_url + "Buttons/m/1/";

    connection.query('Select name , image , dirname From fabrics limit 1', async function (error, results, fields) {
        if (error) {
            console.log((error));
            res.json({
                "Message": "Failed to connect database"
            })
        } else {
            fabricName = results[0].name;
            FabricUrl += results[0].dirname;
            FabricUrl += "/1/";
            FabricUrl += postfix_url;
            fabricIcon = results[0].image;

            connection.query('Select name , image, dirname From linings limit 1', function (error, results, fields) {
                if (error) {
                    console.log((error));
                    res.json({
                        "Message": "Failed to connect database"
                    })
                } else {
                    liningName = results[0].name;
                    LiningUrl += results[0].dirname;
                    LiningUrl += "/1/";
                    LiningUrl += postfix_url;
                    liningIcon = results[0].image;

                    connection.query('Select name , image, dirname From buttons limit 1', function (error, results, fields) {
                        if (error) {
                            console.log((error));
                            res.json({
                                "Message": "Failed to connect database"
                            })
                        } else {
                            buttonName = results[0].name;
                            ButtonUrl += results[0].dirname;
                            ButtonUrl += "/1/";
                            ButtonUrl += postfix_url;
                            buttonIcon = results[0].image;

                            let output = [{"url": FabricUrl, "icon": fabricIcon, "name": fabricName}
                                , {"url": LiningUrl, "icon": liningIcon, "name": liningName}
                                , {"url": ButtonUrl, "icon": buttonIcon, "name": buttonName}];

                            res.json(output)
                        }
                    });
                }
            });
        }
    });
}

function fetchAllFabrics(res) {
    connection.query('Select name , image , content , price From fabrics', function (error, results, fields) {
        if (error) {
            console.log((error));
            res.json({
                "Message": "Failed to connect database"
            })
        } else {
            let output = [];
            results.map(item => {
                output.push(
                    {
                        "name": item.name,
                        "image": item.image,
                        "content": item.content,
                        "price": item.price,
                    }
                )
            });
            res.json(output);
        }
    });
}

function fetchAllLinings(res) {
    connection.query('Select name , image , content , price From linings', function (error, results, fields) {
        if (error) {
            console.log((error));
            res.json({
                "Message": "Failed to connect database"
            })
        } else {
            let output = [];
            results.map(item => {
                output.push(
                    {
                        "name": item.name,
                        "image": item.image,
                        "content": item.content,
                        "price": item.price,
                    }
                )
            });
            res.json(output);
        }
    });
}

function fetchAllButtons(res) {
    connection.query('Select name , image , content , price From buttons', function (error, results, fields) {
        if (error) {
            console.log((error));
            res.json({
                "Message": "Failed to connect database"
            })
        } else {
            let output = [];
            results.map(item => {
                output.push(
                    {
                        "name": item.name,
                        "image": item.image,
                        "content": item.content,
                        "price": item.price,
                    }
                )
            });
            res.json(output);
        }
    });
}

function fetchAllDirectory(res) {
    connection.query('Select dirname From fabrics', function (error, results, fields) {
        if (error) {
            console.log((error));
            res.json({
                "Message": "Failed to connect database"
            })
        } else {
            let output = [];
            results.map(item => {
                output.push(
                    {
                        "dirname": item.dirname
                    }
                )
            });
            res.json(output);
        }
    });
}

function setRenders(req, res) {
    let fabricDir = "";
    let liningDir = "";
    let buttonDir = "";

    connection.query('Select dirname From fabrics where id =  ' + req.params.fabricId, async function (error, results, fields) {
        if (error) {
            console.log((error));
            res.json({
                "Message": "Failed to connect database"
            })
        } else {
            fabricDir += results[0].dirname;
            connection.query('Select dirname From linings where id =  ' + req.params.liningId, function (error, results, fields) {
                if (error) {
                    console.log((error));
                    res.json({
                        "Message": "Failed to connect database"
                    })
                } else {
                    liningDir += results[0].dirname;

                    connection.query('Select dirname From buttons where id = ' + req.params.buttonId, function (error, results, fields) {
                        if (error) {
                            console.log((error));
                            res.json({
                                "Message": "Failed to connect database"
                            })
                        } else {
                            buttonDir += results[0].dirname;

                            let FabricDirectory = `${prefix_url}Fabrics/${req.params.size}/${req.params.model}/${fabricDir}/${req.params.shot}/${postfix_url}`;
                            let LiningDirectory = `${prefix_url}Linings/${req.params.size}/${req.params.model}/${liningDir}/${req.params.shot}/${postfix_url}`;
                            let ButtonDirectory = `${prefix_url}Buttons/${req.params.size}/${req.params.model}/${buttonDir}/${req.params.shot}/${postfix_url}`;

                            res.json([
                                {"url": FabricDirectory},
                                {"url": LiningDirectory},
                                {"url": ButtonDirectory}
                            ]);
                        }
                    });
                }
            });
        }
    });
}

async function createDir(dir) {
    try {
        await fsPromises.access(dir, fs.constants.F_OK);
    } catch (e) {
        await fsPromises.mkdir(dir);
    }
}