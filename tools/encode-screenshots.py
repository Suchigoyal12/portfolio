# Re-encodes the case-study screenshots from their masters (roadmap item 15a).
#
#   python3 tools/encode-screenshots.py
#
# masters/images/<path>.png  ->  public/<path>.webp
#
# Lossless WebP, so every pixel of the (possibly resized) image is kept exactly.
# Images whose long side is over 3200px are resized to 2880px: the full width
# of a 1440px laptop at 2x, which is the largest any lightbox shows them.
# Images at or under 3200px keep their pixels. Resizing an image only slightly
# over the cap makes it BIGGER, not smaller: resampling a flat UI screenshot
# adds soft edges that lossless compression handles badly (measured: 133 KB
# PNG -> 185 KB resized WebP, but 44 KB at original size).
#
# Needs cwebp (brew install webp). Re-run after replacing any master, then run
# node tools/gen-image-dims.mjs so width/height attributes match.
import os, subprocess, glob, tempfile

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
MASTERS = os.path.join(ROOT, "masters", "images")
CAP, RESIZE_ABOVE = 2880, 3200

def dims(p):
    o = subprocess.run(["sips", "-g", "pixelWidth", "-g", "pixelHeight", p], capture_output=True, text=True).stdout.split()
    return int(o[o.index("pixelWidth:") + 1]), int(o[o.index("pixelHeight:") + 1])

for src in sorted(glob.glob(os.path.join(MASTERS, "**", "*.png"), recursive=True)):
    rel = os.path.relpath(src, MASTERS)
    out = os.path.join(ROOT, "public", rel[:-4] + ".webp")
    os.makedirs(os.path.dirname(out), exist_ok=True)
    w, h = dims(src)
    with tempfile.TemporaryDirectory() as t:
        inp = src
        if max(w, h) > RESIZE_ABOVE:
            inp = os.path.join(t, "r.png")
            subprocess.run(["sips", "-Z", str(CAP), src, "--out", inp], capture_output=True, check=True)
        subprocess.run(["cwebp", "-quiet", "-lossless", "-exact", "-z", "9", inp, "-o", out], check=True)
    print(f"{os.path.getsize(src)//1024:6d} -> {os.path.getsize(out)//1024:5d} KB  {rel}")
