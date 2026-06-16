import os
import re

files_to_check = [r'C:\Users\aldor\OneDrive\Desktop\Valentine-Platform\app\(landing)\page.tsx']
catalog_dir = r'C:\Users\aldor\OneDrive\Desktop\Valentine-Platform\app\(landing)\catalog'
for root, _, files in os.walk(catalog_dir):
    for f in files:
        if f == 'page.tsx':
            files_to_check.append(os.path.join(root, f))

for filepath in files_to_check:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Remove all videoSrc key-value pairs entirely:
    content = re.sub(r'videoSrc:\s*"[^"]+",?\s*', '', content)
    
    # Remove all mediaSrc key-value pairs entirely if they are mp4
    content = re.sub(r'mediaSrc="[^"]+\.mp4"\s*', '', content)
    
    # And change mediaType="video" to mediaType="image"
    content = content.replace('mediaType="video"', 'mediaType="image"')
    content = content.replace('mediaType: "video"', 'mediaType: "image"')

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

print("Done")
