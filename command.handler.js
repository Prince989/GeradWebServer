const { exec } = require("child_process");
const { stderr, stdout } = require("process");

let suitTile = 30;
let collarTile = 8;

const address = "C://GeradWebServer-PhotoShop/SuitProcess";

const shots = ["1","2","3","4"]

const model = ["1","2","3"]

const tileData = {
    tile : 5,
    dirname : "blue",
    modelName : 1,
    shotName : 1,
    mode : "fabric"
}

const renderData = {
    dirname : "blue",
    modelName : 1,
    shotName : 1,
    mode : "fabric"
}

module.exports = {
    eshots : shots,

    emodel : model,

    //Render Preview

    renderPreview : (mode,dirname,tile,callback) => {
        j = 0
        RenderPreviews(mode,dirname,tile,j,(err,succ) => {
            if(err){
                callback(err,null);
                return
            }
            callback(null,1)
            return;
        })
    },

    //Render Everything

    finalRender : (mode,dirname,tile,callback) => {
        i = 0;
        j = 0;
        RenderRecursive(mode,dirname,tile,i,j,(err,succ) => {
            if(err){
                callback(err);
                return;
            }
            callback(null,1);
            return;
        })
    }
}

function RenderRecursive(mode,dirname,tile,i,j,callback){
    Render(mode,dirname,tile,model[i],shots[j],(err,succ) => {
        if(err){
            callback(err,null)
            return;
        }
        j++;
        if(j >= shots.length){
            i++;
            j = 0;
            if(i >= model.length){
                callback(null,1)
                return
            }
        }
        RenderRecursive(mode,dirname,tile,i,j,callback);
    })
}

function RenderPreviews(mode,dirname,tile,j,callback){
    Render(mode,dirname,tile,model[0],shots[j],(err,succ) => {
        if(err){
            callback(err,null)
            return;
        }
        j++;
        if(j >= shots.length){
            callback(null,1)
            return
        }
        RenderPreviews(mode,dirname,tile,j,callback);
    })
}

function Render(mode,dirname,tile,model,shot,callback){
    tileCommand = "python \"" + address + "/script/tiling.py" + "\"";
    data = tileData;
    data.tile = tile;
    data.dirname = dirname;
    data.mode = mode;
    data.modelName = model;
    data.shotName = shot;

    tileCommand = dataToCommand(data,tileCommand);

    executeCommand(tileCommand,data,(err,succ) => { // Tile
        if(err){
            callback(err,null);
            return;
        }
        console.log("Tile Set!");
        renderCommand = "python \"" + address +"/script/ChangeSuitFabric.py\""
        data = renderData;
        data.dirname = dirname;
        data.mode = mode;
        data.modelName = model;
        data.shotName = shot;
        console.log(data);
        renderCommand = dataToCommand(data,renderCommand);

        executeCommand(renderCommand,data,(err,succ) => { // Render
            if(err){
                callback(err,null);
                return;
            }
            console.log(`Rendered Model:${data.modelName} Shot: ${data.shotName}`);
            callback(null,1);
        })

    });

}

function dataToCommand(data,cmd){
    for(i = 0;i < Object.keys(data).length ;i++){
        cmd += " -- ?";
    }
    return cmd;
}

function executeCommand(cmd,data,callback){
    argumentCount = cmd.split('?').length;
    if(argumentCount == Object.keys(data).length){
        err = "argument(s) count is not match";
        callback(err,null);
        return;
    }
    for(i = 0;i < argumentCount;i++){
        cmd = cmd.replace("?",data[Object.keys(data)[i]])
    }
    console.log(cmd);
    exec(cmd,(error,stdout,stderr) => {
        if(error){
            console.log(error)
            callback(error,null)
            return
        }
        if(stderr){
            console.log(stderr)
            callback(stderr,null)
            return
        }
        console.log(stdout);
        callback(null,1)
    })
}