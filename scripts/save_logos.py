"""Download and save all official logos for compliance cards."""
import urllib.request
import ssl
import os
import re

logos_dir = r'f:\Hornav_site\public\logos'
os.makedirs(logos_dir, exist_ok=True)

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
}

# 1. BIMCO SVG logo (extracted from bimco.org - official vector with CSS vars replaced with white)
bimco_svg = '''<svg xmlns="http://www.w3.org/2000/svg" width="110" height="52" viewBox="0 0 110 52" fill="none">
    <g clip-path="url(#clip0_3648_7318)">
        <path d="M31.6396 2.41947V4.60958L109.961 6.86303V0.879028L31.6396 2.41947Z" fill="url(#paint0_linear_3648_7318)"></path>
        <path d="M0 1.90462V5.19797L22.4385 4.60958V2.41946L0 1.90462Z" fill="url(#paint1_linear_3648_7318)"></path>
        <path d="M30.032 0.650208V2.45624V4.56872V6.63421H24.0469V4.56872V2.45624V0.650208H30.032Z" fill="white"></path>
        <path d="M109.099 15.3191C108.548 14.0683 107.735 12.9497 106.717 12.038C105.749 11.188 104.63 10.5276 103.419 10.091C101.044 9.21796 98.4368 9.21796 96.0625 10.091C94.8527 10.5286 93.736 11.1898 92.7706 12.04C91.7535 12.9515 90.9426 14.0694 90.392 15.3191C89.7744 16.7499 89.4706 18.2965 89.5011 19.8546V40.9283C89.5011 42.6629 89.8056 44.1972 90.4043 45.4965C90.9564 46.7333 91.7626 47.8401 92.7706 48.7449C93.7376 49.5956 94.8565 50.2561 96.0686 50.6919C98.4422 51.5689 101.051 51.5689 103.425 50.6919C104.637 50.2557 105.756 49.5952 106.723 48.7449C107.736 47.8415 108.547 46.7346 109.103 45.4965C109.702 44.1992 110.007 42.6629 110.007 40.9283V19.8546C110.032 18.2953 109.723 16.7486 109.099 15.3191ZM102.945 40.9283C102.945 42.1153 102.646 42.9489 102.031 43.4739C101.388 44.0042 100.581 44.2942 99.7477 44.2942C98.9144 44.2942 98.107 44.0042 97.4642 43.4739C96.8512 42.9489 96.5508 42.1174 96.5508 40.9283V19.8546C96.5508 18.6676 96.8492 17.834 97.4642 17.309C98.107 16.7787 98.9144 16.4887 99.7477 16.4887C100.581 16.4887 101.388 16.7787 102.031 17.309C102.644 17.834 102.945 18.6676 102.945 19.8546V40.9283Z" fill="white"></path>
        <path d="M55.2042 9.77228H61.9004V51.0127H54.8425V29.9022L50.2244 43.8948H46.3951L41.8342 29.9389V51.0127H34.7764V9.77228H41.4154L48.3363 29.6836L55.2042 9.77228Z" fill="white"></path>
        <path d="M30.0315 9.77229L31.1023 51.0127H22.9736L24.0464 9.77229H30.0315Z" fill="white"></path>
        <path d="M17.3689 13.0799C16.4277 12.0328 15.2666 11.2068 13.9686 10.661C12.5996 10.0665 10.9362 9.76411 9.02159 9.76411H0V51.0127H8.46169C12.3768 51.0127 15.2887 49.9912 17.1134 47.9911C18.9382 45.991 19.8373 43.145 19.8373 39.4676V37.2203C19.8373 35.0322 19.4919 33.2425 18.8156 31.9084C18.2915 30.87 17.5063 29.9857 16.5372 29.3424C16.8254 29.1359 17.103 28.915 17.3689 28.6804C17.904 28.2085 18.3637 27.6573 18.7318 27.046C19.1236 26.3753 19.4058 25.6463 19.5675 24.8865C19.761 23.9347 19.8507 22.9648 19.8352 21.9936V20.5288C19.838 19.1851 19.6495 17.8478 19.2753 16.5572C18.9033 15.272 18.2523 14.0848 17.3689 13.0799ZM13.0062 40.53C12.959 41.1822 12.7745 41.8172 12.4647 42.3932C12.1858 42.8843 11.7648 43.2796 11.2571 43.5271C10.7013 43.8131 9.89003 43.9581 8.84585 43.9581H7.05788V32.5213H8.9092C9.67931 32.4916 10.4481 32.6074 11.1753 32.8625C11.6539 33.0447 12.0687 33.3629 12.3687 33.7778C12.6848 34.2557 12.8856 34.8005 12.9551 35.3693C13.0705 36.2094 13.1245 37.0567 13.1165 37.9047C13.1165 38.8547 13.0777 39.7311 13.0062 40.53ZM12.2522 25.003C11.7332 25.7589 10.6175 26.141 8.96437 26.141H7.05788V16.4897H8.74164C10.4274 16.4897 11.582 16.8595 12.1725 17.5868C12.7978 18.3571 13.1165 19.5727 13.1165 21.1989C13.1165 22.8844 12.8264 24.1613 12.2604 24.9969L12.2522 25.003Z" fill="white"></path>
        <path d="M75.8487 9.43519C77.1859 9.42493 78.5119 9.68049 79.7495 10.187C80.9265 10.6712 81.9935 11.3884 82.8861 12.2954C83.7877 13.2288 84.4941 14.3324 84.9643 15.5418C85.4701 16.8442 85.7239 18.2307 85.7121 19.6278V22.5391H78.6543V19.969C78.6771 19.0651 78.3885 18.1808 77.8369 17.4643C77.6007 17.1487 77.2912 16.8953 76.9353 16.7259C76.5793 16.5565 76.1874 16.4761 75.7935 16.4918C74.6308 16.4918 73.8993 16.8064 73.5458 17.454C73.1371 18.2304 72.9328 19.2458 72.9328 20.4736V40.8732C72.9328 41.8947 73.1514 42.7548 73.5826 43.4249C73.9585 44.0092 74.6635 44.2932 75.7383 44.2932C76.0812 44.2871 76.4213 44.2307 76.7478 44.1257C77.1178 44.0193 77.458 43.8285 77.7417 43.5683C78.0253 43.308 78.2447 42.9855 78.3825 42.6261C78.5881 42.0845 78.684 41.5074 78.6645 40.9284V38.2969H85.7224V41.433C85.7253 42.7329 85.4697 44.0205 84.9704 45.2207C84.4865 46.3937 83.7832 47.4636 82.8984 48.3731C82.0108 49.2762 80.9641 50.0076 79.8108 50.5305C78.6058 51.0771 77.2965 51.3559 75.9733 51.3478C74.7999 51.3421 73.6322 51.1842 72.4996 50.8779C71.3037 50.5595 70.1892 49.9906 69.2301 49.2087C68.2066 48.3614 67.3831 47.2981 66.8189 46.0952C66.2059 44.8162 65.883 43.19 65.883 41.2634V19.2948C65.8741 17.9668 66.1189 16.6493 66.6044 15.4131C67.0669 14.2345 67.7658 13.1631 68.658 12.2648C69.5627 11.3681 70.6375 10.661 71.8191 10.185C73.1007 9.6753 74.4695 9.4206 75.8487 9.43519Z" fill="white"></path>
    </g>
    <defs>
        <linearGradient id="paint0_linear_3648_7318" x1="27.0335" y1="3.87373" x2="109.967" y2="3.87373" gradientUnits="userSpaceOnUse">
            <stop offset="0" stop-color="white"></stop>
            <stop offset="0.5" stop-color="white"></stop>
            <stop offset="1" stop-color="white" stop-opacity="0"></stop>
        </linearGradient>
        <linearGradient id="paint1_linear_3648_7318" x1="0" y1="3.55202" x2="26.9872" y2="3.55202" gradientUnits="userSpaceOnUse">
            <stop offset="0" stop-color="white" stop-opacity="0"></stop>
            <stop offset="0.5" stop-color="white"></stop>
            <stop offset="1" stop-color="white"></stop>
        </linearGradient>
        <clipPath id="clip0_3648_7318">
            <rect width="110" height="50.6996" fill="white" transform="translate(0 0.650208)"></rect>
        </clipPath>
    </defs>
</svg>'''

with open(os.path.join(logos_dir, 'bimco_official.svg'), 'w', encoding='utf-8') as f:
    f.write(bimco_svg)
print("OK: bimco_official.svg saved")

# 2. Download remaining logos from URLs
downloads = {
    # IMO official horizontal logo
    'imo_horizontal.png': 'https://www.imo.org/Content/images/img/English_Colour_RGB_Horizontal.png',
    # IMO emblem
    'imo_emblem_color.png': 'https://www.imo.org/Content/images/img/Emblem_Colour_RGB.png',
    # IACS official from their site
    'iacs_official.svg': 'https://iacs.org.uk/img/common/iacs_logo.svg',
    # NEE logo from their sidebar
    'nee_logo_sidebar.jpg': 'https://nee.gr/wp-content/uploads/2017/03/nays_logo.jpg',
}

for fname, url in downloads.items():
    try:
        path = os.path.join(logos_dir, fname)
        req = urllib.request.Request(url, headers=headers)
        data = urllib.request.urlopen(req, timeout=15, context=ctx).read()
        with open(path, 'wb') as f:
            f.write(data)
        print(f'OK: {fname} ({len(data)} bytes)')
    except Exception as e:
        print(f'FAIL: {fname} - {e}')

# 3. ILO logo - try to download from their official site
ilo_urls = [
    'https://www.ilo.org/resource/image/w800/other/ilo-logo-136x58.png',
    'https://www.ilo.org/sites/default/files/logo.svg',
    'https://www.ilo.org/themes/custom/ilo/logo.svg',
]

for url in ilo_urls:
    try:
        fname = 'ilo_logo_dl.' + url.split('.')[-1]
        path = os.path.join(logos_dir, fname)
        req = urllib.request.Request(url, headers=headers)
        data = urllib.request.urlopen(req, timeout=10, context=ctx).read()
        with open(path, 'wb') as f:
            f.write(data)
        print(f'OK: {fname} ({len(data)} bytes) from {url}')
        break
    except Exception as e:
        print(f'FAIL: {url} - {e}')

print("\nDone!")
