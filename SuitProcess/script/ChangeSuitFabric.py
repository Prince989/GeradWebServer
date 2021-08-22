import photoshop.api as ps
import sys
import string
from photoshop import Session
from pathlib import Path
from PIL import Image
import os

argv = sys.argv
try:
    dirname = argv.index("--") + 1
    modelName = argv.index("--") + 3
    shotName = argv.index("--") + 5
    mode = argv.index("--") + 7

except ValueError:
    dirname = len(argv)
    modelName = len(argv)
    shotName = len(argv)
    mode = len(argv)

dirname = argv[dirname]
modelName = argv[modelName]
shotName = argv[shotName]
mode = argv[mode]

# style 1
app = ps.Application()

address = "C:/GeradWebServer-PhotoShop"

psdaddress = address + "/SuitProcess/" + mode + "/" + modelName + "/" + shotName + ".psd"

uploadaddress = address + "/public/uploads/" + mode + "s/" + dirname + "/export" + ".jpg"
print(shotName)
mkdiraddress = address + "/public/" + mode.capitalize() + "s/m/" + modelName + "/" + dirname + "/" + shotName

Path(mkdiraddress).mkdir(parents=True, exist_ok=True)

saveaddress = address + "/public/" + mode.capitalize() + "s/m/" + modelName + "/" + dirname + "/" + shotName + "/render.png"

app.load(psdaddress)

def replaceImage(SO):
    app.activeDocument.activeLayer = SO
    replace_contents = ps.app.stringIDToTypeID("placedLayerReplaceContents")
    desc = ps.ActionDescriptor
    idnull = ps.app.charIDToTypeID("null")
    desc.putPath(idnull, uploadaddress)
    ps.app.executeAction(replace_contents, desc)
    

def saveImage():
    doc = ps.active_document
    options = ps.PNGSaveOptions()
    doc.saveAs(saveaddress, options, True)

def compress(path):
    picture = Image.open(path)
    picture.save(path,optimize=True,quality=20) 

    print("Compressed SuccessFully!")
    size = "%.2f" % float(os.stat(path).st_size / 1048576)
    print("Size of the render : " + str(size) + " mb")

with Session(psdaddress, action="open") as ps:
    layer_set = ps.active_document.layers
    so = None
    for layer in layer_set:
        if layer.name == "Layer 2 copy 2" :
            so = layer
    if so != None :
        print(so.name)
        replaceImage(so)
    saveImage()
    ps.active_document.close()
#    compress(saveaddress)