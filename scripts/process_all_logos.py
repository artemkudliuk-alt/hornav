"""Process all official logos into white-on-transparent PNGs for use in compliance cards."""
from PIL import Image, ImageOps, ImageFilter
import numpy as np
import os

logos_dir = r'f:\Hornav_site\public\logos'
output_dir = r'f:\Hornav_site\public\logos\processed'
os.makedirs(output_dir, exist_ok=True)


def make_white_on_transparent(img_path: str, out_path: str, threshold: int = 30) -> None:
    """Convert a logo image to white silhouette on transparent background.
    
    Works by:
    1. Converting to RGBA
    2. Making white/light areas transparent (background)
    3. Making dark/colored areas white (the logo itself)
    """
    img = Image.open(img_path).convert('RGBA')
    data = np.array(img)
    
    # Calculate perceived brightness (luminance)
    r, g, b, a = data[:,:,0], data[:,:,1], data[:,:,2], data[:,:,3]
    luminance = 0.299 * r.astype(float) + 0.587 * g.astype(float) + 0.114 * b.astype(float)
    
    # Pixels with high luminance or low alpha are background → transparent
    # Pixels with low luminance or strong color are logo → white
    is_background = (luminance > 230) | (a < 50)
    
    # Create output: white where logo is, transparent where background is
    result = np.zeros_like(data)
    result[:,:,0] = 255  # R = white
    result[:,:,1] = 255  # G = white
    result[:,:,2] = 255  # B = white
    
    # Alpha based on how "dark" the pixel is (inverse of luminance)
    # Stronger (more opaque) where the logo color is darker
    alpha = np.clip((255 - luminance) * (a / 255.0) * 1.5, 0, 255).astype(np.uint8)
    alpha[is_background] = 0
    result[:,:,3] = alpha
    
    out_img = Image.fromarray(result, 'RGBA')
    out_img.save(out_path, 'PNG')
    print(f'  Saved: {os.path.basename(out_path)} ({out_img.size[0]}x{out_img.size[1]})')


def extract_nee_emblem(banner_path: str, out_path: str) -> None:
    """Extract the NEE emblem (green laurel wreath with cross) from the banner image."""
    img = Image.open(banner_path).convert('RGBA')
    w, h = img.size
    
    # The emblem is on the left side of the banner (roughly first 15% width)
    # Crop the emblem area
    emblem_region = img.crop((0, 0, int(w * 0.08), h))
    
    # Now make it white on transparent
    data = np.array(emblem_region)
    r, g, b, a = data[:,:,0], data[:,:,1], data[:,:,2], data[:,:,3]
    luminance = 0.299 * r.astype(float) + 0.587 * g.astype(float) + 0.114 * b.astype(float)
    
    # The emblem uses green color on a light/sky-blue background
    # Detect the green + dark colored parts of the emblem
    is_background = (luminance > 200) | (a < 50)
    
    result = np.zeros_like(data)
    result[:,:,0] = 255
    result[:,:,1] = 255
    result[:,:,2] = 255
    alpha = np.clip((255 - luminance) * (a / 255.0) * 2.0, 0, 255).astype(np.uint8)
    alpha[is_background] = 0
    result[:,:,3] = alpha
    
    out_img = Image.fromarray(result, 'RGBA')
    # Trim transparent edges
    bbox = out_img.getbbox()
    if bbox:
        out_img = out_img.crop(bbox)
    # Scale up for quality
    if out_img.size[0] < 200:
        scale = 200 / out_img.size[0]
        out_img = out_img.resize(
            (int(out_img.size[0] * scale), int(out_img.size[1] * scale)),
            Image.LANCZOS
        )
    out_img.save(out_path, 'PNG')
    print(f'  Saved NEE emblem: {os.path.basename(out_path)} ({out_img.size[0]}x{out_img.size[1]})')


# Process each logo
print("=== Processing logos ===\n")

# 1. IMO Emblem (color → white)
print("1. IMO Emblem:")
make_white_on_transparent(
    os.path.join(logos_dir, 'imo_emblem_color.png'),
    os.path.join(output_dir, 'imo_emblem_white.png')
)

# 2. IMO Horizontal logo (already white - verify)
print("\n2. IMO Horizontal Logo:")
imo_h = Image.open(os.path.join(logos_dir, 'imo_horizontal.png')).convert('RGBA')
print(f'  IMO horizontal: {imo_h.size[0]}x{imo_h.size[1]} (checking if already processed...)')
data = np.array(imo_h)
# Check if it's already white-on-transparent
avg_r = data[:,:,0][data[:,:,3] > 50].mean() if (data[:,:,3] > 50).any() else 0
print(f'  Average R value of visible pixels: {avg_r:.0f}')
if avg_r > 240:
    print('  Already white! Copying as-is.')
    imo_h.save(os.path.join(output_dir, 'imo_logo_white.png'), 'PNG')
else:
    print('  Converting to white...')
    make_white_on_transparent(
        os.path.join(logos_dir, 'imo_horizontal.png'),
        os.path.join(output_dir, 'imo_logo_white.png')
    )

# 3. NEE emblem from banner
print("\n3. NEE Emblem (from banner):")
extract_nee_emblem(
    os.path.join(logos_dir, 'nee_top_banner.jpg'),
    os.path.join(output_dir, 'nee_emblem_white.png')
)

# 4. NEE 90 years logo → white
print("\n4. NEE 90 Years Logo:")
make_white_on_transparent(
    os.path.join(logos_dir, 'nee_full_90years.jpg'),
    os.path.join(output_dir, 'nee_90_white.png')
)

# 5. Danamira logo (should already be white)
print("\n5. Danamira Logo:")
dam = Image.open(os.path.join(logos_dir, 'logo_danamira.png')).convert('RGBA')
data = np.array(dam)
avg_r = data[:,:,0][data[:,:,3] > 50].mean() if (data[:,:,3] > 50).any() else 0
print(f'  Average R value of visible pixels: {avg_r:.0f}')
if avg_r > 240:
    print('  Already white! Copying as-is.')
    dam.save(os.path.join(output_dir, 'danamira_white.png'), 'PNG')
else:
    make_white_on_transparent(
        os.path.join(logos_dir, 'logo_danamira.png'),
        os.path.join(output_dir, 'danamira_white.png')
    )

# 6. logo_imo.png (the processed version - check)
print("\n6. Existing IMO logo (logo_imo.png):")
imo_existing = Image.open(os.path.join(logos_dir, 'logo_imo.png')).convert('RGBA')
data = np.array(imo_existing)
avg_r = data[:,:,0][data[:,:,3] > 50].mean() if (data[:,:,3] > 50).any() else 0
print(f'  Size: {imo_existing.size[0]}x{imo_existing.size[1]}, avg R: {avg_r:.0f}')
if avg_r > 240:
    print('  Already white! Keeping.')
    imo_existing.save(os.path.join(output_dir, 'imo_existing_white.png'), 'PNG')

print("\n=== Done! ===")
print(f"\nProcessed logos in: {output_dir}")
for f in sorted(os.listdir(output_dir)):
    fpath = os.path.join(output_dir, f)
    size = os.path.getsize(fpath)
    print(f'  {f} ({size} bytes)')
