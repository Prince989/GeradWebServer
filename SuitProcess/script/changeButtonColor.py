import sys
import bpy

def hex_to_rgb( hex_value ):
    b = (hex_value & 0xFF) / 255.0
    g = ((hex_value >> 8) & 0xFF) / 255.0
    r = ((hex_value >> 16) & 0xFF) / 255.0
    return r, g, b


argv = sys.argv
try:
    color = argv.index("--") + 1
    bdirname = argv.index("--") + 3
    modelName = argv.index("--") + 5
    shotName = argv.index("--") + 7
    
except ValueError:
    color = len(argv)
    bdirname = len(argv)
    modelName = len(argv)
    shotName = len(argv)

color = argv[color]
bdirname = argv[bdirname]
modelName = argv[modelName]
shotName = argv[shotName]

mat = bpy.data.materials['Button']

# get all material nodes
nodes = mat.node_tree.nodes

# get the mapping node
map_node = nodes.get("Principled BSDF")

end = len(color)
color = color[1 : end]

print(color)

color = "0x" + color

color = int(color,16)


map_node.inputs["Base Color"].default_value = (*hex_to_rgb(color),1)

bpy.ops.wm.save_as_mainfile(filepath="E:\\GeradWebServer\\GeradWebServer\\SuitProcess\\Buttons\\" + modelName + "\\" + shotName + ".blend")
