import requests, re, json, sys

UA = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'}

# --- Bing image search ---
try:
    r = requests.get('https://www.bing.com/images/search',
                     params={'q': 'data center server room', 'form': 'HDRSC2'},
                     headers=UA, timeout=30)
    print('bing', r.status_code, len(r.text))
    urls = re.findall(r'"murl":"(.*?)"', r.text)
    print('  murls found:', len(urls))
    for u in urls[:8]:
        print('   ', u[:120])
except Exception as e:
    print('bing fail', e)

# --- DuckDuckGo token flow ---
try:
    s = requests.Session()
    s.headers.update(UA)
    r0 = s.get('https://duckduckgo.com/', timeout=25)
    vqd = None
    m = re.search(r'vqd=["\']?([\d-]+)', r0.text)
    if m:
        vqd = m.group(1)
    print('ddg vqd', vqd)
    if vqd:
        r = s.get('https://duckduckgo.com/i.js',
                  params={'q': 'data center server room', 'o': 'json', 'vqd': vqd, 'f': ',,,', 'p': '1'},
                  headers={'Referer': 'https://duckduckgo.com/'}, timeout=30)
        print('  ddg i.js', r.status_code, len(r.text))
        if r.status_code == 200:
            d = r.json()
            for it in d.get('results', [])[:8]:
                print('   ', (it.get('title') or '')[:40], '|', (it.get('image') or '')[:90])
except Exception as e:
    print('ddg fail', e)

# --- Startpage ---
try:
    r = requests.get('https://www.startpage.com/sp/search',
                     params={'query': 'data center server room', 'cat': 'images'},
                     headers=UA, timeout=30)
    print('startpage', r.status_code, len(r.text))
    urls = re.findall(r'"(https://[^"]+?\.jpe?g)"', r.text)
    print('  imgs:', len(urls))
    for u in urls[:6]:
        print('   ', u[:120])
except Exception as e:
    print('startpage fail', e)
