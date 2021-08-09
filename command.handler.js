const { exec } = require("child_process");
const { stderr } = require("process");

let suitTile = 30;
let collarTile = 8;

const shots = ["SuitFront","SuitBack","SuitFrontZoom","SuitInner"]
const model = ["1","2","3"]

let RenderCommandPreview = `\"E:\\Program Files\\Blender Foundation\\Blender 2.93\\blender.exe\" -b \"E:\\GeradWebServer\\GeradWebServer\\SuitProcess\\Suit\\Suit.blend\" -f 1 -- --cycles-device CUDA+CPU`;

let RenderCommand = `\"E:\\Program Files\\Blender Foundation\\Blender 2.93\\blender.exe\" -b \"E:\\GeradWebServer\\GeradWebServer\\SuitProcess\\Fabrics\\MODEL_SUIT\\SHOT_SUIT.blend\" -o \"E:\\GeradWebServer\\GeradWebServer\\public\\Fabrics\\m\\MODEL_SUIT\\DIRECTORY_NAME\\SHOT_SUIT\\render\" -f 1 -- --cycles-device CUDA+CPU`;

let TextureSetCommandPreview = `\"E:\\Program Files\\Blender Foundation\\Blender 2.93\\blender.exe\" -b \"E:\\GeradWebServer\\GeradWebServer\\SuitProcess\\Suit\\Suit.blend\" -P "E:\\GeradWebServer\\GeradWebServer\\SuitProcess\\script\\changeTexturePreview.py\" -- SUITTILE_VARIABLE -- COLLARTILE_VARIABLE -- DIRECTORY_NAME`;

let TextureSetCommand = `\"E:\\Program Files\\Blender Foundation\\Blender 2.93\\blender.exe\" -b \"E:\\GeradWebServer\\GeradWebServer\\SuitProcess\\Fabrics\\MODEL_SUIT\\SHOT_BLENDER\" -P "E:\\GeradWebServer\\GeradWebServer\\SuitProcess\\script\\changeTexture.py\" -- SUITTILE_VARIABLE -- COLLARTILE_VARIABLE -- DIRECTORY_NAME -- MODEL_SUIT -- SHOT_FILE`;

let CompressCommandPreview = "python \"E:\\GeradWebServer\\GeradWebServer\\SuitProcess\\script\\compressRender.py\" "

let LiningSetColorCommand = `"E:\\Program Files\\Blender Foundation\\Blender 2.93\\blender.exe" -b "E:\\GeradWebServer\\GeradWebServer\\SuitProcess\\Linings\\1\\SuitFrontZoom.blend" -P "E:\\GeradWebServer\\GeradWebServer\\SuitProcess\\script\\changeLiningColorPreview.py" -- "COLOR_VALUE"`;

let LiningPreviewRender = `"E:\\Program Files\\Blender Foundation\\Blender 2.93\\blender.exe" -b "E:\\GeradWebServer\\GeradWebServer\\SuitProcess\\Linings\\1\\SuitFrontZoom.blend" -f 1`

module.exports = {
    eshots : shots,

    emodel : model,

    previewLiningRender : (color,callback) => {
        let cmd = LiningSetColorCommand.replace("COLOR_VALUE",color);
        exec(cmd,(error,stdout,stderr) => {
            if (error) {
                console.log(`error: ${error.message}`);
                callback(error.message,null);
                return;
            }
            if (stderr) {
                console.log(`stderr: ${stderr}`);
                callback(stderr,null);
                return;
            }
            console.log(`stdout: ${stdout}`);
            
            exec(LiningPreviewRender,(error,stdout,stderr) => {
                if (error) {
                    console.log(`error: ${error.message}`);
                    callback(error.message,null);
                    return;
                }
                if (stderr) {
                    console.log(`stderr: ${stderr}`);
                    callback(stderr,null);
                    return;
                }
                console.log(`stdout: ${stdout}`);

                callback(null,1);
            })
        });
    },
    renderPreview : (suitTile,collarTile,fdirname,callback) => {
        console.log(collarTile);

        let cmd = TextureSetCommandPreview.replace("SUITTILE_VARIABLE",suitTile).replace("COLLARTILE_VARIABLE",collarTile).replace("DIRECTORY_NAME",fdirname);
        
        console.log(cmd);

        exec(cmd, (error, stdout, stderr) => {
            if (error) {
                console.log(`error: ${error.message}`);
                callback(error.message,null);
                return;
            }
            if (stderr) {
                console.log(`stderr: ${stderr}`);
                callback(stderr,null);
                return;
            }
            console.log(`stdout: ${stdout}`);

            exec(RenderCommandPreview,(error,stdout,stderr) => {
                if (error) {
                    console.log(`error: ${error.message}`);
                    callback(error.message,null);
                    return;
                }
                if (stderr) {
                    console.log(`stderr: ${stderr}`);
                    callback(stderr,null);
                    return;
                }
                console.log(`stdout: ${stdout}`);
                exec(CompressCommandPreview,(error,stdout,stderr) => {
                    if (error) {
                        console.log(`error: ${error.message}`);
                        callback(error.message,null);
                        return;
                    }
                    if (stderr) {
                        console.log(`stderr: ${stderr}`);
                        callback(stderr,null);
                        return;
                    }
                    console.log(stdout);
                    callback(null,"SuccessFull!");
                })
            });
        });
    },
    previewFabricRenders : (suitTile,collarTile,fdirname,callback) => {
        let i = 0 , j = 0;

        SetFabricModel(suitTile,collarTile,fdirname,shots,i,j,callback);

    }
}
function SetFabricModel(suitTile,collarTile,fdirname,shots,i,j,callback){

    SetFabricShot(suitTile,collarTile,fdirname,shots,i,j,callback,(err,succ)=>{
        if(!err || succ){
            j++;
            if(j < model.length)
                SetFabricModel(suitTile,collarTile,fdirname,shots,i,j,callback);
            else
//                callback(null,"SuccessFull!");
                RenderFabricModel(fdirname,0,0,callback)
        }
    });

}
function SetFabricShot(suitTile,collarTile,fdirname,shots,i,j,callback,callbackInner){
    let cmd = TextureSetCommand.replace("SUITTILE_VARIABLE",suitTile)
    .replace("COLLARTILE_VARIABLE",collarTile)
    .replace("DIRECTORY_NAME",fdirname)
    .replace("MODEL_SUIT",model[j])
    .replace("MODEL_SUIT",model[j])
    .replace("SHOT_BLENDER",shots[i] + ".blend")
    .replace("SHOT_FILE",shots[i]);

    exec(cmd,(error,stdout,stderr) => {
        if(error){
            console.log(error);
            callback(error,null);
            callbackInner(error,null);
            return;
        }
        if(stderr){
            console.log(stderr);
            callback(stderr,null);
            callbackInner(error,null);
            return;
        }
        console.log(stdout);
        i++;

        if(i < shots.length)
            SetFabricShot(suitTile,collarTile,fdirname,shots,i,j,callback,callbackInner);
        else{
            callbackInner(null,1);
        }
    })
}
function RenderFabricModel(fdirname,i,j,callback){
    
    RenderFabricShot(fdirname,i,j,callback,(err,succ) => {
        if(!err || succ){
            j++;
            if(j < model.length)
                RenderFabricModel(fdirname,i,j,callback);
            else
                callback(null,"SuccessFull!");
        }
    });
}
function RenderFabricShot(fdirname,i,j,callback,callback2){
    let cmd = RenderCommand
    .replace("MODEL_SUIT",model[j])
    .replace("MODEL_SUIT",model[j])
    .replace("SHOT_SUIT",shots[i])
    .replace("SHOT_SUIT",i+1)
    .replace("DIRECTORY_NAME",fdirname)
    .replace("DIRECTORY_NAME",fdirname)
    
    console.log(cmd);

    exec(cmd,(error,stdout,stderr) => {
        if(error){
            console.log(error);
            callback(error,null);
            callback2(error,null);
            return;
        }   
        if(stderr){
            console.log(stderr);
            callback(stderr,null);
            callback2(stderr,null);
            return;
        } 
        console.log(stdout);
        i++;
        if(i < shots.length)
            RenderFabricShot(fdirname,i,j,callback,callback2);
        else
            callback2(null,1);
    })
}