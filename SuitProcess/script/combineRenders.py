from PIL import Image

print("Hello")
'''
background = Image.open("E:/GeradWebServer/GeradWebServer/public/Fabrics/m/1/rivington/1/render.png")
foreground = Image.open("E:/GeradWebServer/GeradWebServer/public/Linings/m/1/ardington/1/render.png")
s = Image.new("RGBA",background.size,1.0)
s1 = Image.blend(s,background,1)

s1 = Image.new("RGBA",background.size,1.0)

#background.paste(foreground, (0, 0),background)
Image.alpha_composite(background, foreground).save("E://Suit.png")
'''

def trans_paste(fg_img,bg_img,alpha=1.0):
    fg_img_trans = Image.new("RGBA",fg_img.size)
    fg_img_trans = Image.blend(fg_img_trans,fg_img,alpha)
    bg_img.paste(fg_img_trans,fg_img_trans.size,fg_img_trans)
    return bg_img

bg_img = Image.open("E:/GeradWebServer/GeradWebServer/public/Fabrics/m/1/rivington/1/render.png")
fg_img = Image.open("E:/GeradWebServer/GeradWebServer/public/Linings/m/1/ardington/1/render.png")
p = trans_paste(fg_img,bg_img,.7)

p.save("E://Suit.png")