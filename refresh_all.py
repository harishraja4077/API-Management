import os, requests, time
from PIL import Image
from io import BytesIO
from collections import defaultdict

IMAGES_DIR = "images"
UA = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'}

# Map each filename to (source_url_candidates, target_size)
# Pick images that fit dimensions/style
targets = [
    # Hero/large banners
    ("index-hero-1.webp", ["https://images.pexels.com/photos/373543/pexels-photo-373543.jpeg?auto=compress&cs=tinysrgb&w=1920"],
     (1920,1080)),
    ("index-hero-2.webp", ["https://images.pexels.com/photos/261579/pexels-photo-261579.jpeg?auto=compress&cs=tinysrgb&w=1920"],
     (1920,1080)),
    ("index-hero-3.webp", ["https://images.pexels.com/photos/17323801/pexels-photo-17323801.jpeg?auto=compress&cs=tinysrgb&w=1920"],
     (1920,1080)),
    ("about-page-hero.webp", ["https://images.pexels.com/photos/5489456/pexels-photo-5489456.jpeg?auto=compress&cs=tinysrgb&w=1920"],
     (1920,1080)),
    ("blog-page-hero.webp", ["https://images.pexels.com/photos/17489158/pexels-photo-17489158.jpeg?auto=compress&cs=tinysrgb&w=1920"],
     (1920,1080)),
    ("contact-page-hero.webp", ["https://images.pexels.com/photos/17489156/pexels-photo-17489156.jpeg?auto=compress&cs=tinysrgb&w=1920"],
     (1920,1080)),
    ("services-page-hero.webp", ["https://images.pexels.com/photos/5408005/pexels-photo-5408005.jpeg?auto=compress&cs=tinysrgb&w=1920"],
     (1920,1080)),
    
    # Card images 740x400
    ("index-capability-gateway.webp", ["https://images.pexels.com/photos/5203849/pexels-photo-5203849.jpeg?auto=compress&cs=tinysrgb&w=1480"],
     (740,400)),
    ("index-capability-observability.webp", ["https://images.pexels.com/photos/373543/pexels-photo-373543.jpeg?auto=compress&cs=tinysrgb&w=1480"],
     (740,400)),
    ("index-capability-portal.webp", ["https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=1480"],
     (740,400)),
    ("index-capability-security.webp", ["https://images.pexels.com/photos/60504/security-protection-anti-virus-software-60504.jpeg?auto=compress&cs=tinysrgb&w=1480"],
     (740,400)),
    
    # About/story
    ("index-about-preview.webp", ["https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=1800"],
     (900,675)),
    ("about-story-1.webp", ["https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=2400"],
     (1200,400)),
    ("about-story-2.webp", ["https://images.pexels.com/photos/1181677/pexels-photo-1181677.jpeg?auto=compress&cs=tinysrgb&w=1200"],
     (600,500)),
    ("about-story-3.webp", ["https://images.pexels.com/photos/1181298/pexels-photo-1181298.jpeg?auto=compress&cs=tinysrgb&w=1200"],
     (600,500)),
    ("about-why.webp", ["https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&cs=tinysrgb&w=1800"],
     (900,675)),
    
    # Facility
    ("about-facility-court.webp", ["https://images.pexels.com/photos/5489456/pexels-photo-5489456.jpeg?auto=compress&cs=tinysrgb&w=1600"],
     (800,600)),
    ("about-facility-observability.webp", ["https://images.pexels.com/photos/373543/pexels-photo-373543.jpeg?auto=compress&cs=tinysrgb&w=1600"],
     (800,600)),
    ("about-facility-pool.webp", ["https://images.pexels.com/photos/17489156/pexels-photo-17489156.jpeg?auto=compress&cs=tinysrgb&w=1600"],
     (800,600)),
    
    # Team photos (portraits)
    ("about-team-mark.webp", ["https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1200"],
     (600,800)),
    ("about-team-sarah.webp", ["https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=1200"],
     (600,800)),
    ("about-team-david.webp", ["https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1200"],
     (600,800)),
    ("about-team-elena.webp", ["https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1200"],
     (600,800)),
    
    # Services facilities
    ("services-facility-strength.webp", ["https://images.pexels.com/photos/1181677/pexels-photo-1181677.jpeg?auto=compress&cs=tinysrgb&w=1600"],
     (800,560)),
    ("services-facility-pool.webp", ["https://images.pexels.com/photos/17489158/pexels-photo-17489158.jpeg?auto=compress&cs=tinysrgb&w=1600"],
     (800,560)),
    ("services-facility-courts.webp", ["https://images.pexels.com/photos/5203849/pexels-photo-5203849.jpeg?auto=compress&cs=tinysrgb&w=1600"],
     (800,560)),
    
    # Events
    ("index-event-launch.webp", ["https://images.pexels.com/photos/1181298/pexels-photo-1181298.jpeg?auto=compress&cs=tinysrgb&w=1480"],
     (740,440)),
    ("index-event-workshop.webp", ["https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&cs=tinysrgb&w=1480"],
     (740,440)),
    ("index-event-onboarding.webp", ["https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=1480"],
     (740,440)),
    
    # Avatars small
    ("index-avatar-alex-thompson.webp", ["https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=320"],
     (160,160)),
    ("index-avatar-lisa-martinez.webp", ["https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=320"],
     (160,160)),
    ("index-avatar-james-wilson.webp", ["https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=320"],
     (160,160)),
    
    # Gallery
    ("index-gallery-1.webp", ["https://images.pexels.com/photos/5489456/pexels-photo-5489456.jpeg?auto=compress&cs=tinysrgb&w=2096"],
     (1048,460)),
    ("index-gallery-2.webp", ["https://images.pexels.com/photos/373543/pexels-photo-373543.jpeg?auto=compress&cs=tinysrgb&w=1140"],
     (570,500)),
    ("index-gallery-3.webp", ["https://images.pexels.com/photos/17489158/pexels-photo-17489158.jpeg?auto=compress&cs=tinysrgb&w=1140"],
     (570,500)),
    ("index-gallery-4.webp", ["https://images.pexels.com/photos/1181298/pexels-photo-1181298.jpeg?auto=compress&cs=tinysrgb&w=1140"],
     (570,500)),
    ("index-gallery-5.webp", ["https://images.pexels.com/photos/1181677/pexels-photo-1181677.jpeg?auto=compress&cs=tinysrgb&w=1140"],
     (570,500)),
    ("index-gallery-6.webp", ["https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=2280"],
     (1140,500)),
    
    # Blog
    ("blog-featured.webp", ["https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&cs=tinysrgb&w=1800"],
     (900,600)),
    ("blog-post-core-strength.webp", ["https://images.pexels.com/photos/1181677/pexels-photo-1181677.jpeg?auto=compress&cs=tinysrgb&w=1480"],
     (740,480)),
    ("blog-post-freestyle.webp", ["https://images.pexels.com/photos/1181298/pexels-photo-1181298.jpeg?auto=compress&cs=tinysrgb&w=1480"],
     (740,480)),
    ("blog-post-serve-tips.webp", ["https://images.pexels.com/photos/60504/security-protection-anti-virus-software-60504.jpeg?auto=compress&cs=tinysrgb&w=1480"],
     (740,480)),
    ("blog-post-nutrition.webp", ["https://images.pexels.com/photos/373543/pexels-photo-373543.jpeg?auto=compress&cs=tinysrgb&w=1480"],
     (740,480)),
    ("blog-video-hiit.webp", ["https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&cs=tinysrgb&w=1480"],
     (740,400)),
    ("blog-video-portal.webp", ["https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=1480"],
     (740,400)),
    ("blog-video-freestyle.webp", ["https://images.pexels.com/photos/1181298/pexels-photo-1181298.jpeg?auto=compress&cs=tinysrgb&w=1480"],
     (740,400)),
    
    # Blog authors
    ("blog-author-mark.webp", ["https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=360"],
     (180,180)),
    ("blog-author-sarah.webp", ["https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=360"],
     (180,180)),
    ("blog-author-david.webp", ["https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=360"],
     (180,180)),
    ("blog-author-elena.webp", ["https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=360"],
     (180,180)),
]

def process_image(filename, urls, target_size):
    out_path = os.path.join(IMAGES_DIR, filename)
    for url in urls:
        try:
            print(f"Fetching {filename} from {url[:80]}...")
            r = requests.get(url, headers=UA, timeout=60)
            r.raise_for_status()
            img = Image.open(BytesIO(r.content))
            if img.mode in ('RGBA','LA','P'):
                bg = Image.new('RGB', img.size, (255,255,255))
                if img.mode == 'P':
                    img = img.convert('RGBA')
                if img.mode == 'RGBA':
                    bg.paste(img, mask=img.split()[-1])
                else:
                    bg.paste(img)
                img = bg
            elif img.mode != 'RGB':
                img = img.convert('RGB')
            # Crop to aspect ratio
            tw, th = target_size
            target_ar = tw/th
            iw, ih = img.size
            img_ar = iw/ih
            if abs(img_ar - target_ar) > 0.01:
                if img_ar > target_ar:
                    new_w = int(ih * target_ar)
                    left = (iw - new_w)//2
                    img = img.crop((left, 0, left+new_w, ih))
                else:
                    new_h = int(iw / target_ar)
                    top = (ih - new_h)//2
                    img = img.crop((0, top, iw, top+new_h))
            img = img.resize(target_size, Image.Resampling.LANCZOS)
            # Save webp under 98KB
            for q in range(90, 25, -5):
                img.save(out_path, format='WEBP', quality=q, method=6)
                sz = os.path.getsize(out_path)/1024
                if sz <= 98:
                    print(f"  OK {filename}: {tw}x{th} {sz:.1f}KB q={q}")
                    return True
            print(f"  DONE {filename} (>{98}KB?) {os.path.getsize(out_path)/1024:.1f}KB")
            return True
        except Exception as e:
            print(f"  ERR {filename}: {e}")
            continue
    return False

os.makedirs(IMAGES_DIR, exist_ok=True)
ok = 0
for fn, urls, ts in targets:
    if process_image(fn, urls, ts):
        ok += 1
    time.sleep(0.5)
print(f"\nUpdated {ok}/{len(targets)} images")
