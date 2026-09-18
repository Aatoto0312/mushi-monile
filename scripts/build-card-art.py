"""Build presentation-only artwork manifest from card reference pages.
Run with the read-only reference directory as the first argument.
"""
import concurrent.futures
import json
import pathlib
import re
import sys
import urllib.request

ROOT = pathlib.Path(__file__).resolve().parents[1]
REFERENCE = pathlib.Path(sys.argv[1])

def image_from_html(html):
    match = re.search(r'<meta property="og:image" content="([^"]+)"', html)
    return match.group(1) if match else None

def first_set(number):
    url = f'https://mushijingi.com/card/MUSHI/{number}/'
    with urllib.request.urlopen(url, timeout=30) as response:
        image = image_from_html(response.read().decode('utf-8'))
    return f'BOOSTER_SET_1:{number}', {'image': image, 'source': url}

manifest = {}
for set_number in range(2, 8):
    for path in sorted((REFERENCE / f'set{set_number}').glob('card-*.html')):
        number = int(path.stem.split('-')[1])
        manifest[f'BOOSTER_SET_{set_number}:{number}'] = {
            'image': image_from_html(path.read_text(encoding='utf-8')),
            'source': f'https://mushijingi.com/card/MUSHI{set_number}/{number}/'
        }
with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:
    for key, value in pool.map(first_set, range(1, 131)):
        manifest[key] = value
target = ROOT / 'shared/card-art-manifest.js'
target.write_text('(function(root){ root.MushiCardArt = ' + json.dumps(manifest, ensure_ascii=False, indent=2) + '; })(typeof window !== "undefined" ? window : globalThis);\n', encoding='utf-8')
print(f'Artwork source manifest: {len(manifest)} entries')
