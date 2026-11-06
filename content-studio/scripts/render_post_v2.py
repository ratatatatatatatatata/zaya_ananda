#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Message-first Ananda poster. Original v1 renderer and assets stay intact."""
import argparse
import html
import json
from pathlib import Path
import unicodedata
from PIL import Image, ImageFont
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
import resvg_py
from render_post import CORE, ROOT, data_uri, digest


def build(draft, image, out_dir, template=None):
    t = template or json.loads((ROOT/"brand/template-v2.json").read_text(encoding="utf-8"))
    out_dir = Path(out_dir)
    if out_dir.exists():
        raise FileExistsError("Previous output preserved; choose a new version")
    lines = draft["headline"]
    if not isinstance(lines, list) or not 1 <= len(lines) <= 2 or not all(isinstance(s, str) and s.strip() for s in lines):
        raise ValueError("Use one or two nonempty headline lines")
    support = draft.get("support", "")
    if not isinstance(support, str) or not isinstance(draft.get("caption"), str) or not draft["caption"].strip():
        raise ValueError("Support must be text and caption must be complete")
    if any("\n" in s or "\r" in s for s in lines+[support]):
        raise ValueError("Use explicit headline lines and one support line")
    with Image.open(image) as im:
        if min(im.size) < 600:
            raise ValueError("Image is too small")
    normal, outlined, records = [], [], []
    def both(s):
        normal.append(s); outlined.append(s)
    def text(s, role, baseline, color):
        if not s:
            return
        s = unicodedata.normalize("NFC", s)
        path = ROOT/"brand"/role["file"]
        ft = TTFont(path); cmap = ft.getBestCmap()
        missing = sorted({c for c in CORE+s if not c.isspace() and ord(c) not in cmap})
        if missing:
            raise ValueError("Missing glyphs: " + "".join(missing))
        axes = {a.axisTag:a.defaultValue for a in ft["fvar"].axes}; axes["wght"] = role["weight"]
        pil = ImageFont.truetype(str(path), role["size"])
        pil.set_variation_by_axes([axes[a.axisTag] for a in ft["fvar"].axes])
        gs = ft.getGlyphSet(location=axes); x = role["x"]
        b = pil.getbbox(s, anchor="ls")
        bounds = [x+b[0],baseline+b[1],x+max(b[2],pil.getlength(s)),baseline+b[3]]
        left, top, right, bottom = role["safe_box"]
        if bounds[0] < left or bounds[1] < top or bounds[2] > right or bounds[3] > bottom:
            raise ValueError("Copy overflows fixed template; shorten it: " + s)
        scale = role["size"]/ft["head"].unitsPerEm
        paths = []
        for i,c in enumerate(s):
            pen = SVGPathPen(gs); gs[cmap[ord(c)]].draw(pen)
            if pen.getCommands():
                advance = pil.getlength(s[:i+1])-pil.getlength(c)
                paths.append(f'<path d="{pen.getCommands()}" transform="translate({x+advance:.6f} {baseline}) scale({scale:.9f} {-scale:.9f})"/>')
        outlined.append(f'<g fill="{color}" aria-label="{html.escape(s,quote=True)}"><title>{html.escape(s)}</title>'+"".join(paths)+"</g>")
        normal.append(f'<text x="{x}" y="{baseline}" font-family="{role["family"]}" font-size="{role["size"]}" font-weight="{role["weight"]}" fill="{color}">{html.escape(s)}</text>')
        records.append({"text":s,"bounds":bounds,"family":role["family"],"weight":role["weight"],"size":role["size"],"font_sha256":digest(path),"missing_glyphs":[]})
    both('<rect width="1080" height="1350" fill="#FFFFFF"/>')
    x,y,w,h = t["image_box"]
    both(f'<image id="topic-image" href="{data_uri(image)}" x="{x}" y="{y}" width="{w}" height="{h}" preserveAspectRatio="{t["image_crop"]}"/>')
    for r in t.get("panels", []):
        x,y,w,h = r["box"]
        both(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" fill="{r["fill"]}"/>')
    logo = ROOT/"brand/logo.png"; x,y,w,h = t["logo_box"]
    both(f'<image id="official-logo" href="{data_uri(logo)}" x="{x}" y="{y}" width="{w}" height="{h}" preserveAspectRatio="xMidYMid meet"/>')
    for i,s in enumerate(lines):
        role=t["headline"];text(s,role,role["baselines"][i],role["colors"][i])
    role=t["support"];text(support,role,role["baseline"],role["color"])
    # Actual painted bounds, not font-size guesses, establish line separation.
    for a,b in zip(records, records[1:]):
        if a["bounds"][3]+16 > b["bounds"][1]:
            raise ValueError("Text rows collide or have insufficient separation")
    prefix='<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1350" viewBox="0 0 1080 1350"><title>Zaya’s Ananda Center</title><desc>Versioned review proof; original logo and supporting image retained. Editorial copy is not a verified teacher quote.</desc>'
    master=prefix+"".join(normal)+"</svg>";paths=prefix+"".join(outlined)+"</svg>"
    png=resvg_py.svg_to_bytes(svg_string=paths,skip_system_fonts=True)
    out_dir.mkdir(parents=True)
    values={"poster.png":png,"poster-editable.svg":master,"poster-outlined.svg":paths,"caption.txt":draft["caption"]+"\n","copy.txt":"\n".join(lines+[support]),"draft.json":json.dumps(draft,ensure_ascii=False,indent=2)}
    for name,value in values.items():
        with (out_dir/name).open("xb") as f:f.write(value if isinstance(value,bytes) else value.encode("utf-8"))
    with Image.open(out_dir/"poster.png") as im:
        assert im.size==(1080,1350)
        im.resize((360,450),Image.Resampling.LANCZOS).save(out_dir/"phone-preview.png")
    report={"template_id":t["id"],"template_status":t["status"],"logo_sha256":digest(logo),"image_sha256":digest(image),"image_box":t["image_box"],"logo_box":t["logo_box"],"text":records,"outputs":{n:digest(out_dir/n) for n in values},"user_approved":False,"published":False}
    with (out_dir/"verification.json").open("x",encoding="utf-8") as f:json.dump(report,f,ensure_ascii=False,indent=2)
    return report


def main():
    p=argparse.ArgumentParser(description=__doc__)
    p.add_argument("--draft",required=True,type=Path);p.add_argument("--image",required=True,type=Path);p.add_argument("--out",required=True,type=Path)
    a=p.parse_args();build(json.loads(a.draft.read_text(encoding="utf-8")),a.image,a.out)
    print(json.dumps({"poster":str(a.out/"poster.png"),"template":"ananda-message-first-v2"},ensure_ascii=False))


if __name__=="__main__":
    main()
