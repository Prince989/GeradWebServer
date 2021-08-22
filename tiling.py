import cv2
import numpy as np
import math
import sys
import photoshop.api as ps
import sys
import string
from photoshop import Session
from photoshop.api.enumerations import DialogModes, SaveOptions


argv = sys.argv
try:
    x = argv.index("--") + 1
    dirname = argv.index("--") + 3
    modelName = argv.index("--") + 5
    shotName = argv.index("--") + 7
    mode = argv.index("--") + 9

except ValueError:
    x = len(argv)
    dirname = len(argv)
    modelName = len(argv)
    shotName = len(argv)
    mode = len(argv)

x = int(argv[x])
dirname = argv[dirname]
modelName = argv[modelName]
shotName = argv[shotName]
mode = argv[mode]

y = x


# style 1
def getSize():
    desc = ps.ActionDescriptor
    ps.app.executeAction(ps.app.stringIDToTypeID("placedLayerEditContents"),desc)
    smartDoc = app.activeDocument
    reach_width = smartDoc.width
    reach_height = smartDoc.height
    smartDoc.close()
    return reach_width,reach_height

app = ps.Application()
address = "C:/GeradWebServer/SuitProcess/ss.psd"
app.displayDialogs = DialogModes.DisplayNoDialogs
app.load(address)

with Session(address, action="open") as ps:
    layer_set = ps.active_document.layers
    so = None
    for layer in layer_set:
        if layer.name == "Layer 2 copy 2" :
            so = layer
    if so != None :
        print(so.name)
        reach_width,reach_height =  getSize()
    
    print(reach_width,reach_height)

    ps.active_document.close(SaveOptions.DoNotSaveChanges)

    address = "C:/GeradWebServer-PhotoShop/public/uploads/"  + mode + "s/"

    uploadaddress = address + dirname + "/upload" + ".jpg"

    im1 = cv2.imread(uploadaddress)

    height = im1.shape[0]
    width = im1.shape[1]

    t0 = reach_width / width
    t1 = reach_height / height

    v = max(t0,t1)

    reach_height = v * height
    reach_width = v * width

    xx = math.ceil(reach_width/x)
    yy = math.ceil(reach_height/y)

    v = max(xx,yy)

    def concat_tile(im_list_2d):
        return cv2.vconcat([cv2.hconcat(im_list_h) for im_list_h in im_list_2d])

    im1_s = cv2.resize(im1, dsize=(v, v), fx=0.5, fy=0.5)

    matrix = y*[x*[im1_s]]

    im_tile = concat_tile(matrix)

    uploadaddress = address + dirname + "/export" + ".jpg"

    cv2.imwrite(uploadaddress, im_tile)

    print("done")