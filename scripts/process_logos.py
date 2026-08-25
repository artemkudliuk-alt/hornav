import os, urllib.request, re
from PIL import Image, ImageOps, ImageFilter

logos_dir = 'f:/Hornav_site/public/logos'
os.makedirs(logos_dir, exist_ok=True)

def process_to_white_png(input_path, output_path):
    try:
        img = Image.open(input_path).convert('RGBA')
        gray = img.convert('L')
        # Check background brightness
        corners = [gray.getpixel((0, 0)), gray.getpixel((img.width-1, 0)), gray.getpixel((0, img.height-1)), gray.getpixel((img.width-1, img.height-1))]
        avg_corner = sum(corners) / 4.0
        
        r, g, b, a = img.split()
        if avg_corner > 160: # Light bg
            # Invert
            inv = ImageOps.invert(gray)
            alpha = inv.point(lambda p: 0 if p < 45 else min(255, int((p - 45) * 1.35)))
        else:
            if a.getextrema() != (255, 255):
                alpha = a
            else:
                alpha = gray.point(lambda p: 0 if p < 45 else min(255, int((p - 45) * 1.35)))
                
        white_img = Image.new('RGBA', img.size, (255, 255, 255, 0))
        white_img.putalpha(alpha)
        bbox = white_img.getbbox()
        if bbox:
            white_img = white_img.crop(bbox)
        white_img.save(output_path, 'PNG')
        print(f'Processed {output_path}: size={white_img.size}')
    except Exception as e:
        print(f'Error processing {input_path}: {e}')

# 1. IMO
if os.path.exists(f'{logos_dir}/imo_logo.png'):
    process_to_white_png(f'{logos_dir}/imo_logo.png', f'{logos_dir}/logo_imo.png')

# 2. NEE (Hellenic Chamber of Shipping)
if os.path.exists(f'{logos_dir}/nee_logo.jpg'):
    process_to_white_png(f'{logos_dir}/nee_logo.jpg', f'{logos_dir}/logo_nee.png')

# 3. Danamira
for root, dirs, files in os.walk('f:/Hornav_site'):
    for f in files:
        if 'Danamira_logo' in f and f.endswith('.png'):
            process_to_white_png(os.path.join(root, f), f'{logos_dir}/logo_danamira.png')
            break
