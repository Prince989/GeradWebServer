import sys
import bpy

#str = sys.argv[1]

#path = str.replace('/','\\')

argv = sys.argv
try:
    index = argv.index("--") + 1
    suitTile = argv.index("--") + 1
    collarTile = argv.index("--") + 3
    fdirname = argv.index("--") + 5
    
except ValueError:
    index = len(argv)
    suitTile = len(argv)
    collarTile = len(argv)
    fdirname = len(argv)

fdirname = argv[fdirname]
suitTile = argv[suitTile]
collarTile = argv[collarTile]

argv = argv[index]


print(suitTile)
print(collarTile)


suitTile = int(suitTile)
path = "E:\\GeradWebServer\\GeradWebServer\\public\\uploads\\fabrics\\" + fdirname
bpy.data.images['DiffuseMap.jpg'].filepath = path + '\\DiffuseMap.jpg'
bpy.data.images['NormalMap.jpg'].filepath = path + '\\NormalMap.jpg'
bpy.data.images['DisplacementMap.jpg'].filepath = path + '\\AlphaMap.jpg'
bpy.data.images['MetalMap.jpg'].filepath = path + '\\MetalMap.jpg'
bpy.data.images['RoughnessMap.jpg'].filepath = path + '\\RoughnessMap.jpg'

# get the material
mat = bpy.data.materials['Suit']

# get all material nodes
nodes = mat.node_tree.nodes

# get the mapping node
map_node = nodes.get("Mapping")

# set the rotation z component
map_node.inputs["Scale"].default_value = (suitTile,suitTile,suitTile)

ColMat = bpy.data.materials['Collar']

nodes2 = ColMat.node_tree.nodes

# get the mapping node
map_node2 = nodes2.get("Mapping")
collarTile = int(collarTile)

print("collar :" + str(collarTile))

# set the rotation z component
map_node2.inputs["Scale"].default_value = (collarTile,collarTile,collarTile)


'''
'''
print ("Done")

bpy.ops.wm.save_as_mainfile(filepath="E:\\GeradWebServer\\GeradWebServer\\SuitProcess\\Suit\\Suit.blend")
