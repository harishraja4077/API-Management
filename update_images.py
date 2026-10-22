import os
import requests
import json
from PIL import Image
from io import BytesIO
import time

# Map image files to search queries
image_map = [
    # Logo - keep or update? The user says "all images should be related to API Management so update all images"
    # But logo might be special; let's check - it's "stackly logo.webp". The alt text says "Stackly". Maybe update it too.
    ("stackly logo.webp", "api tech logo abstract geometric"),
    
    # Index page
    ("index-hero-1.webp", "api gateway technology server network"),
    ("index-hero-2.webp", "cloud api management dashboard code"),
    ("index-hero-3.webp", "data center servers networking"),
    ("index-about-preview.webp", "software development team api coding"),
    ("index-capability-gateway.webp", "api gateway routing network"),
    ("index-capability-observability.webp", "api monitoring analytics dashboard"),
    ("index-capability-portal.webp", "developer portal api documentation"),
    ("index-capability-security.webp", "api security authentication lock shield"),
    ("index-event-launch.webp", "tech conference launch product"),
    ("index-event-workshop.webp", "api workshop coding training"),
    ("index-event-onboarding.webp", "developers collaborating api"),
    ("index-avatar-alex-thompson.webp", "professional man developer headshot"),
    ("index-avatar-lisa-martinez.webp", "professional woman developer headshot"),
    ("index-avatar-james-wilson.webp", "professional man engineer headshot"),
    ("index-gallery-1.webp", "server room data center"),
    ("index-gallery-2.webp", "code programming computer screen"),
    ("index-gallery-3.webp", "cloud infrastructure technology"),
    ("index-gallery-4.webp", "api integration network"),
    ("index-gallery-5.webp", "digital transformation technology"),
    ("index-gallery-6.webp", "tech team working together"),
    
    # About page
    ("about-page-hero.webp", "api management platform technology"),
    ("about-story-1.webp", "software engineering team collaboration"),
    ("about-story-2.webp", "developer coding api"),
    ("about-story-3.webp", "tech team meeting"),
    ("about-why.webp", "api architecture diagram concept"),
    ("about-facility-court.webp", "server infrastructure datacenter"),
    ("about-facility-observability.webp", "monitoring dashboard analytics"),
    ("about-facility-pool.webp", "cloud computing infrastructure"),
    ("about-team-mark.webp", "professional software engineer portrait"),
    ("about-team-sarah.webp", "professional tech lead portrait"),
    ("about-team-david.webp", "professional api architect portrait"),
    ("about-team-elena.webp", "professional developer portrait"),
    
    # Services page
    ("services-page-hero.webp", "api management services technology"),
    ("services-facility-strength.webp", "api testing security"),
    ("services-facility-pool.webp", "cloud api services"),
    ("services-facility-courts.webp", "api gateway infrastructure"),
    
    # Blog page
    ("blog-page-hero.webp", "api development blog technology"),
    ("blog-featured.webp", "api design architecture"),
    ("blog-post-core-strength.webp", "rest api coding"),
    ("blog-post-freestyle.webp", "graphql api development"),
    ("blog-post-serve-tips.webp", "api authentication security"),
    ("blog-post-nutrition.webp", "api best practices"),
    ("blog-video-hiit.webp", "api tutorial coding"),
    ("blog-video-portal.webp", "developer portal showcase"),
    ("blog-video-freestyle.webp", "api integration example"),
    ("blog-author-mark.webp", "tech blogger portrait"),
    ("blog-author-sarah.webp", "api writer portrait"),
    ("blog-author-david.webp", "technical writer portrait"),
    ("blog-author-elena.webp", "developer advocate portrait"),
    
    # Contact page
    ("contact-page-hero.webp", "customer support tech api"),
]

IMAGES_DIR = "images"
os.makedirs(IMAGES_DIR, exist_ok=True)

def download_and_convert(filename, query):
    try:
        # Use Unsplash source (no API key needed for basic usage)
        url = f"https://source.unsplash.com/1600x900/?{query.replace(' ', ',')}"
        print(f"Downloading {filename} for query: {query}")
        response = requests.get(url, timeout=30)
        response.raise_for_status()
        
        # Open image
        img = Image.open(BytesIO(response.content))
        # Convert to RGB if necessary
        if img.mode in ('RGBA', 'LA', 'P'):
            bg = Image.new('RGB', img.size, (255, 255, 255))
            if img.mode == 'P':
                img = img.convert('RGBA')
            bg.paste(img, mask=img.split()[-1] if img.mode == 'RGBA' else None)
            img = bg
        elif img.mode != 'RGB':
            img = img.convert('RGB')
        
        # Resize to reasonable dimensions while maintaining aspect ratio
        img.thumbnail((1600, 900), Image.Resampling.LANCZOS)
        
        # Save as WebP with quality adjustment to get under 98KB
        output_path = os.path.join(IMAGES_DIR, filename)
        quality = 85
        while quality >= 40:
            img.save(output_path, format='WEBP', quality=quality, method=6)
            size_kb = os.path.getsize(output_path) / 1024
            if size_kb <= 98:
                print(f"  Saved {filename} - {size_kb:.1f}KB (quality={quality})")
                break
            quality -= 5
        else:
            # If still too big, resize more
            img = img.resize((1200, 675), Image.Resampling.LANCZOS)
            quality = 80
            while quality >= 30:
                img.save(output_path, format='WEBP', quality=quality, method=6)
                size_kb = os.path.getsize(output_path) / 1024
                if size_kb <= 98:
                    print(f"  Saved {filename} (resized) - {size_kb:.1f}KB (quality={quality})")
                    break
                quality -= 5
        
        time.sleep(1)  # Be nice to the API
    except Exception as e:
        print(f"  Error downloading {filename}: {e}")

# Download all images
for filename, query in image_map:
    if filename in [f for f in os.listdir(IMAGES_DIR) if f.endswith('.webp')]:
        download_and_convert(filename, query)
    else:
        print(f"Skipping {filename} - not found in images directory")

print("\nDone!")
