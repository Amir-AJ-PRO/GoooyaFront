from PIL import Image
import os

paths = [
    r"C:\Users\amirh\.cursor\projects\f-front-goooya\assets\tutak-sit.jpg",
    r"C:\Users\amirh\.cursor\projects\f-front-goooya\assets\halva-wave.jpg",
    r"C:\Users\amirh\.cursor\projects\f-front-goooya\assets\asalak-jump.jpg",
    r"C:\Users\amirh\.cursor\projects\f-front-goooya\assets\tutak-stand.jpg",
]
for p in paths:
    im = Image.open(p)
    print(os.path.basename(p), im.format, im.mode, im.size)
    px = im.convert("RGB")
    w, h = px.size
    corners = [(0, 0), (w - 1, 0), (0, h - 1), (w - 1, h - 1), (10, 10), (w // 2, 5)]
    for c in corners:
        print(" ", c, px.getpixel(c))
    print("---")
