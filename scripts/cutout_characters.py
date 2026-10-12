"""Remove light checkerboard/studio background and save transparent PNGs."""

from __future__ import annotations

from collections import deque
from pathlib import Path

from PIL import Image, ImageFilter

ROOT = Path(r"C:\Users\amirh\.cursor\projects\f-front-goooya\assets")
OUT = Path(r"f:\front goooya\GooyaMelkFront\public\assets\stories\characters")
OUT.mkdir(parents=True, exist_ok=True)

JOBS = [
    ("tutak-sit.jpg", "tutak-sit.png"),
    ("halva-wave.jpg", "halva-wave.png"),
    ("asalak-jump.jpg", "asalak-jump.png"),
    ("tutak-stand.jpg", "tutak-stand.png"),
]


def is_bg_color(rgb: tuple[int, int, int]) -> bool:
    r, g, b = rgb
    # لباس کرم، عسل و پوست گرم‌اند؛ شطرنجی بک‌گراند تقریباً خاکستری است
    if r > b + 10 or g > b + 16:
        return False
    chroma = max(r, g, b) - min(r, g, b)
    return min(r, g, b) >= 198 and chroma <= 16


def flood_background(im: Image.Image) -> Image.Image:
    rgb = im.convert("RGB")
    w, h = rgb.size
    pix = rgb.load()
    alpha = Image.new("L", (w, h), 255)
    ap = alpha.load()
    seen = bytearray(w * h)

    seeds: list[tuple[int, int]] = []
    for x in range(0, w, 8):
        seeds.append((x, 0))
        seeds.append((x, h - 1))
    for y in range(0, h, 8):
        seeds.append((0, y))
        seeds.append((w - 1, y))

    q: deque[tuple[int, int]] = deque()
    for x, y in seeds:
        if is_bg_color(pix[x, y]):
            q.append((x, y))
            seen[y * w + x] = 1

    while q:
        x, y = q.popleft()
        ap[x, y] = 0
        for nx, ny in ((x - 1, y), (x + 1, y), (x, y - 1), (x, y + 1)):
            if nx < 0 or ny < 0 or nx >= w or ny >= h:
                continue
            idx = ny * w + nx
            if seen[idx]:
                continue
            n = pix[nx, ny]
            if is_bg_color(n):
                seen[idx] = 1
                q.append((nx, ny))

    alpha = alpha.filter(ImageFilter.MinFilter(3))
    alpha = alpha.filter(ImageFilter.GaussianBlur(0.8))
    out = rgb.convert("RGBA")
    out.putalpha(alpha)
    return out


def crop_alpha(im: Image.Image, pad: int = 8) -> Image.Image:
    bbox = im.getbbox()
    if not bbox:
        return im
    l, t, r, b = bbox
    l = max(0, l - pad)
    t = max(0, t - pad)
    r = min(im.width, r + pad)
    b = min(im.height, b + pad)
    return im.crop((l, t, r, b))


def main() -> None:
    for src_name, dest_name in JOBS:
        src = ROOT / src_name
        dest = OUT / dest_name
        print("cutout", src_name)
        cut = flood_background(Image.open(src))
        cut = crop_alpha(cut)
        cut.save(dest, "PNG")
        print(" saved", dest, cut.size, cut.mode)


if __name__ == "__main__":
    main()
