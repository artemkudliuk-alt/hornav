import os
from PIL import Image, ImageDraw, ImageFont, ImageOps, ImageFilter

logos_dir = 'f:/Hornav_site/public/logos'
os.makedirs(logos_dir, exist_ok=True)

# 1. Check existing images
print('Logos in dir:', os.listdir(logos_dir))
