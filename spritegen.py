from PIL import Image
import cv2
import numpy as np
import os

# Load image with alpha channel
image_path = "images/tulips.png"
output_folder = "tulips_output"
os.makedirs(output_folder, exist_ok=True)

# Load with PIL, convert to RGBA, then to numpy
pil_img = Image.open(image_path).convert("RGBA")
np_img = np.array(pil_img)

# Extract alpha channel and threshold it
alpha_channel = np_img[:, :, 3]
_, thresh = cv2.threshold(alpha_channel, 1, 255, cv2.THRESH_BINARY)

# Find connected components
num_labels, labels, stats, _ = cv2.connectedComponentsWithStats(thresh, connectivity=8)

# Extract each tulip as a separate image
for i in range(1, num_labels):  # skip background (label 0)
    x, y, w, h, area = stats[i]
    if area < 50:
        continue  # ignore very small blobs
    
    crop = pil_img.crop((x, y, x + w, y + h))
    crop.save(os.path.join(output_folder, f"tulip_{i:02}.png"))

print(f"Saved {num_labels - 1} tulip images to '{output_folder}/'")