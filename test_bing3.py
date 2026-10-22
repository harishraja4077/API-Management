import requests, re
UA={'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
r=requests.get('https://bing.com/images/search',params={'q':'server room','form':'HDRSC2'},headers=UA,timeout=30)
urls=re.findall(r'https://[^"\'\s]+\.(?:jpg|jpeg|png)', r.text)
urls=list(set(urls))
print(len(urls))
for u in urls[:25]:
    print(u)
