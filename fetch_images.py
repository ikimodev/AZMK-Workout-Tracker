import urllib.request
import json
import os
import ssl

ssl._create_default_https_context = ssl._create_unverified_context

items = [
    'Dumbbell', 'Barbell', 'Weight plate', 'Kettlebell', 'Trap bar', 
    'Pull-up (exercise)', 'Power rack', 'Bench (weight training)', 'Dip bar',
    'Cable machine', 'Lat pulldown machine', 'Leg press', 'Smith machine',
    'Treadmill', 'Indoor rower', 'Stationary bicycle', 'Elliptical trainer', 
    'Stairmaster', 'Resistance band', 'Battling ropes', 'Gymnastics rings', 
    'Jump rope', 'Medicine ball'
]

os.makedirs('public/assets/equipment', exist_ok=True)

for item in items:
    url = f"https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&format=json&piprop=original&titles={urllib.parse.quote(item)}"
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req) as response:
            data = json.loads(response.read().decode())
            pages = data['query']['pages']
            page = list(pages.values())[0]
            if 'original' in page:
                img_url = page['original']['source']
                ext = img_url.split('.')[-1]
                print(f"Found {item}: {img_url}")
            else:
                print(f"No image for {item}")
    except Exception as e:
        print(f"Error {item}: {e}")
