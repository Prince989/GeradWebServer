const { exec } = require("child_process");

let suitTile = 30;
let collarTile = 8;

let RenderCommand = `\"E:\\Program Files\\Blender Foundation\\Blender 2.93\\blender.exe\" -b \"E:\\GeradWebServer\\GeradWebServer\\SuitProcess\\Suit\\Suit.blend\" -f 1 -- --cycles-device CUDA+CPU`;

let TextureSetCommand = `\"E:\\Program Files\\Blender Foundation\\Blender 2.93\\blender.exe\" -b \"E:\\GeradWebServer\\GeradWebServer\\SuitProcess\\Suit\\Suit.blend\" -P "E:\\GeradWebServer\\GeradWebServer\\SuitProcess\\script\\changeTexture.py\" -- SUITTILE_VARIABLE -- COLLARTILE_VARIABLE -- DIRECTORY_NAME`;

let CompressCommand = "python \"E:\\GeradWebServer\\GeradWebServer\\SuitProcess\\script\\compressRender.py\" "

module.exports = {
    renderPreview : (suitTile,collarTile,fdirname,callback) => {
        console.log(collarTile);

        let cmd = TextureSetCommand.replace("SUITTILE_VARIABLE",suitTile).replace("COLLARTILE_VARIABLE",collarTile).replace("DIRECTORY_NAME",fdirname);
        
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

            exec(RenderCommand,(error,stdout,stderr) => {
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
                exec(CompressCommand,(error,stdout,stderr) => {
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
    }
}
