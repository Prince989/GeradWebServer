import photoshop.api as ps
from photoshop import Session

# style 1
app = ps.Application()
app.load("C:/Users/AsaRayan/Desktop/bb.psd")

def replaceImage(SO):
    app.activeDocument.activeLayer = SO
    replace_contents = ps.app.stringIDToTypeID("placedLayerReplaceContents")
    desc = ps.ActionDescriptor
    idnull = ps.app.charIDToTypeID("null")
    desc.putPath(idnull, "C:/Users/AsaRayan/Desktop/fabrics/vv.png")
    ps.app.executeAction(replace_contents, desc)
    

def saveImage():
    doc = ps.active_document
    options = ps.PNGSaveOptions()
    doc.saveAs("C:/Users/AsaRayan/Desktop/BiohBioh.png", options, True)

# style 2
with Session("C:/Users/AsaRayan/Desktop/bb.psd", action="open") as ps:
    layer_set = ps.active_document.layers
    so = None
    for layer in layer_set:
        if layer.name == "Rectangle 1" :
            so = layer
    if so != None :
        print(so.name)
        replaceImage(so)
    saveImage()
        
