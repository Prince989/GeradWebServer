from PIL import Image
import sys
import PIL
import os
import glob
'''
argv = sys.argv
try:
    index = argv.index("--") + 1
    
except ValueError:
    index = len(argv)

fdirname = argv[index]
'''
path = 'E:\\GeradWebServer\\GeradWebServer\\public\\uploads\\preview\\0001.png'
#file_name = 'E:\GeradWebServer\GeradWebServer\SuitProcess\script\Render.png'
picture = Image.open(path)

picture.save(path,optimize=True,quality=40) 

print("Compressed SuccessFully!")
size = "%.2f" % float(os.stat('E:\\GeradWebServer\\GeradWebServer\\public\\uploads\\preview\\0001.png').st_size / 1048576)
print("Size of the render : " + str(size) + " mb")