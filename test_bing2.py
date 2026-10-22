import requests, re
UA={'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'}
r=requests.get('https://bing.com/images/search',params={'q':'server room','form':'HDRSC2','first':1},headers=UA,timeout=30)
print('status',r.status_code)
urls=re.findall(r'https://[^"\'>\s]+\.(?:jpg|jpeg|png)',r.text)
print('count',len(urls))
for u in set(urls)[:20]:
    print(u)
