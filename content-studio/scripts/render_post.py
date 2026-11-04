#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""One fixed brand template; deterministic PNG plus editable and outlined SVG."""
import argparse
import base64
import hashlib
import html
import json
from pathlib import Path
import unicodedata
from PIL import Image, ImageFont
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
import resvg_py

ROOT = Path(__file__).resolve().parents[1]
CORE = "АБВГДЕЁЖЗИЙКЛМНОӨПРСТУҮФХЦЧШЩЪЫЬЭЮЯабвгдеёжзийклмноөпрстуүфхцчшщъыьэюя"

def digest(path):
    return hashlib.sha256(Path(path).read_bytes()).hexdigest()

def data_uri(path):
    path = Path(path)
    with Image.open(path) as im:
        mime = Image.MIME[im.format]
    return "data:" + mime + ";base64," + base64.b64encode(path.read_bytes()).decode("ascii")

def build(draft, image, out_dir, template=None):
    t = template or json.loads((ROOT / "brand/template-v1.json").read_text(encoding="utf-8"))
    titles = draft["headline"]
    if not isinstance(titles, list) or not 1 <= len(titles) <= t["headline"]["max_lines"] or not all(isinstance(x, str) and x.strip() for x in titles):
        raise ValueError("Headline must contain one or two nonempty lines")
    support = draft.get("support", "")
    if not isinstance(support, str) or "\n" in support:
        raise ValueError("Support must be one line")
    caption = draft.get("caption", "")
    if not isinstance(caption, str) or not caption.strip():
        raise ValueError("A finished caption is required")
    if any("\n" in s or "\r" in s for s in titles):
        raise ValueError("Use separate headline lines")
    with Image.open(image) as im:
        if min(im.size) < 600:
            raise ValueError("Supporting image is too small")
    normal, outlines, records = [], [], []
    def both(value):
        normal.append(value); outlines.append(value)
    def text(s, role, baseline):
        if not s:
            return
        s = unicodedata.normalize("NFC", s)
        font_path = ROOT / "brand" / role["file"]
        ft = TTFont(font_path); cmap = ft.getBestCmap()
        missing = sorted({c for c in CORE + s if not c.isspace() and ord(c) not in cmap})
        if missing:
            raise ValueError("Missing Mongolian glyphs: " + "".join(missing))
        pil = ImageFont.truetype(str(font_path), role["size"])
        axes = {a.axisTag: a.defaultValue for a in ft["fvar"].axes}
        axes["wght"] = role["weight"]
        pil.set_variation_by_axes([axes[a.axisTag] for a in ft["fvar"].axes])
        gs = ft.getGlyphSet(location=axes)
        bbox = pil.getbbox(s, anchor="ls")
        x = role["x"]
        bounds = [x + bbox[0], baseline + bbox[1], x + max(bbox[2], pil.getlength(s)), baseline + bbox[3]]
        if bounds[0] < 72 or bounds[2] > t["safe_right"] or bounds[1] < 960 or bounds[3] > t["safe_bottom"]:
            raise ValueError("Copy overflows the fixed template; shorten it: " + s)
        scale = role["size"] / ft["head"].unitsPerEm
        paths = []
        for i, c in enumerate(s):
            pen = SVGPathPen(gs); gs[cmap[ord(c)]].draw(pen)
            if pen.getCommands():
                advance = pil.getlength(s[:i+1]) - pil.getlength(c)
                paths.append(f'<path d="{pen.getCommands()}" transform="translate({x+advance:.5f} {baseline}) scale({scale:.9f} {-scale:.9f})"/>')
        outlines.append(f'<g fill="{role["color"]}" aria-label="{html.escape(s, quote=True)}"><title>{html.escape(s)}</title>' + "".join(paths) + "</g>")
        normal.append(f'<text x="{x}" y="{baseline}" font-family="{role["family"]}" font-size="{role["size"]}" font-weight="{role["weight"]}" fill="{role["color"]}">{html.escape(s)}</text>')
        records.append({"text": s, "bounds": bounds, "font": role["family"], "weight": role["weight"], "font_sha256": digest(font_path), "missing_glyphs": []})
    both(f'<rect width="1080" height="1350" fill="{t["background"]}"/>')
    logo = ROOT / "brand" / t["logo"]["file"]
    x, y, w, h = t["logo"]["box"]
    both(f'<image id="official-logo" href="{data_uri(logo)}" x="{x}" y="{y}" width="{w}" height="{h}" preserveAspectRatio="xMidYMid meet"/>')
    x, y, w, h = t["image_box"]
    both(f'<image id="topic-image" href="{data_uri(image)}" x="{x}" y="{y}" width="{w}" height="{h}" preserveAspectRatio="xMidYMax slice"/>')
    for i, line in enumerate(titles):
        text(line, t["headline"], t["headline"]["baseline"] + i*t["headline"]["line_height"])
    text(support, t["support"], t["support"]["baseline"])
    prefix = '<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1350" viewBox="0 0 1080 1350"><title>Zaya’s Ananda Center</title><desc>Review proof. Copy is editorial, not a verified teacher quotation. Font files are required to edit text.</desc>'
    # Render everything before creating an exclusive output directory.
    outlined = prefix + "".join(outlines) + "</svg>"
    png = resvg_py.svg_to_bytes(svg_string=outlined, skip_system_fonts=True)
    if out_dir.exists():
        raise FileExistsError("Choose a new output version")
    out_dir.mkdir(parents=True)
    files = {"poster.png": png, "poster-editable.svg": prefix+"".join(normal)+"</svg>", "poster-outlined.svg": outlined, "caption.txt": caption+"\n", "copy.txt": "\n".join(titles+[support]), "draft.json": json.dumps(draft, ensure_ascii=False, indent=2)}
    for name, value in files.items():
        with (out_dir/name).open("xb") as f:
            f.write(value.encode("utf-8") if isinstance(value, str) else value)
    with Image.open(out_dir/"poster.png") as im:
        assert im.size == (1080,1350)
    report = {"template_id": t["id"], "template_status": t["status"], "dimensions": [1080,1350], "logo_sha256": digest(logo), "image_sha256": digest(image), "text": records, "outputs": {name: digest(out_dir/name) for name in files}, "publication": False, "user_design_approval": False}
    with (out_dir/"verification.json").open("x", encoding="utf-8") as f:
        json.dump(report, f, ensure_ascii=False, indent=2)
    return report

def main():
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument("--draft", required=True, type=Path)
    p.add_argument("--image", required=True, type=Path)
    p.add_argument("--out", required=True, type=Path)
    a = p.parse_args()
    build(json.loads(a.draft.read_text(encoding="utf-8")), a.image, a.out)
    print(json.dumps({"poster": str(a.out/"poster.png"), "template": "ananda-editorial-v1", "status": "rendered-review-proof"}, ensure_ascii=False))

if __name__ == "__main__":
    main()
