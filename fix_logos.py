import re, os, glob

files = glob.glob('*.html')
for f in files:
    with open(f, encoding='utf-8') as fh:
        s = fh.read()
    orig = s
    
    # Replace any img tag with stackly logo that is not inside an <a> 
    pattern = r'(?<!<a[^>]*>)<img([^>]*?)src="images/stackly logo\.webp"([^>]*)>(?!\s*</a>)'
    
    def repl(m):
        return '<a href="index.html"><img' + m.group(1) + 'src="images/stackly logo.webp"' + m.group(2) + '></a>'
    
    s2, count = re.subn(pattern, repl, s)
    
    if s2 != orig:
        with open(f, 'w', encoding='utf-8') as fh:
            fh.write(s2)
        print('updated', f, count)
    else:
        print('ok', f)
