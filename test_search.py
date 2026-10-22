import requests, json, sys

UA = {'User-Agent': 'StacklyImageUpdater/1.0 (image refresh script)'}
API = 'https://commons.wikimedia.org/w/api.php'

def search(query, limit=8):
    params = {
        'action': 'query',
        'generator': 'search',
        'gsrsearch': f'filetype:bitmap {query}',
        'gsrnamespace': 6,
        'gsrlimit': limit,
        'prop': 'imageinfo',
        'iiprop': 'url|size|mime|extmetadata',
        'iiurlwidth': 1600,
        'format': 'json',
    }
    r = requests.get(API, params=params, headers=UA, timeout=40)
    r.raise_for_status()
    pages = r.json().get('query', {}).get('pages', {})
    out = []
    for p in pages.values():
        ii = (p.get('imageinfo') or [{}])[0]
        if not ii.get('thumburl'):
            continue
        out.append({
            'title': p.get('title'),
            'thumb': ii.get('thumburl'),
            'w': ii.get('thumbwidth'), 'h': ii.get('thumbheight'),
            'mime': ii.get('mime'),
            'lic': (ii.get('extmetadata', {}).get('LicenseShortName', {}) or {}).get('value', ''),
        })
    return out

queries = [
    "API gateway", "software developer computer code screen", "data center server rack",
    "network diagram switch", "devops engineer server", "software team collaboration office",
    "programming code monitor", "cloud computing infrastructure abstract", "kubernetes containers",
    "portrait software engineer man", "portrait businesswoman professional", "tech conference audience",
    "dashboard analytics screen", "cybersecurity lock code", "web developer laptop",
]

for q in queries:
    try:
        res = search(q, 6)
        print(f"\n=== {q}  ({len(res)}) ===")
        for i in res:
            print(f"   {i['title'][:70]:72s} {i['w']}x{i['h']} {i['lic']}")
    except Exception as e:
        print(q, 'FAIL', e)
