import re, glob

files = glob.glob('*.html')
for f in files:
    with open(f, encoding='utf-8') as fh:
        s = fh.read()
    orig = s
    
    # Find all img tags with stackly logo
    def wrap_logo(m):
        full = m.group(0)
        # Check if inside an anchor tag
        # Look backwards for <a
        start = m.start()
        # simple check - if there's <a without </a> between start of line context and img
        before = s[max(0,start-200):start]
        if '<a ' in before and '</a>' not in before[before.rfind('<a '):]:
            return full
        if before.count('<a') > before.count('</a>'):
            return full
        return '<a href="index.html">' + full + '</a>'
    
    pattern = r'<img[^>]+src="images/stackly logo\.webp"[^>]*>'
    s2 = re.sub(pattern, wrap_logo, s)
    
    if s2 != orig:
        with open(f, 'w', encoding='utf-8') as fh:
            fh.write(s2)
        print('updated', f)
    else:
        print('ok', f)
